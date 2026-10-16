<script setup lang="ts">

    import { useGameStore } from '~/stores/game'

    const gameStore = useGameStore()    

    // General displaying

    useHead({

        title: () => { if (gameStore.isInitialized.value) return gameStore.customGameName.value || gameStore.t('title')
                       else return 'FG Factory' },
    })

    const groupTabs = computed(() => {

        const groups = gameStore.availableGroups.map(group => ({

            label: gameStore.t(`groups.${group}`),
            value: group
        }))

        groups.push({

            label: gameStore.t('groups.admin'),
            value: 'admin'
        })

        return groups
    })

    const activeGroup = ref<string>('')

    watch(() => gameStore.availableGroups, (groups) => {

        if (groups.length > 0 && !activeGroup.value) {
            activeGroup.value = groups[0]
        }

    }, { immediate: true })

    const activeSubgroups = computed(() => {

        const subgroups: Record<string, Item[]> = {}

        const items = gameStore.items.filter(item => item.group === activeGroup.value)

        for (const item of items) {

            if (!item.subgroup) continue
            if (!subgroups[item.subgroup]) subgroups[item.subgroup] = []
            
            subgroups[item.subgroup].push(item)
        }
        
        return subgroups
    })

    onMounted(() => { gameStore.loadGame() })

    // Options Modal

    const isOptionsOpen = ref(false)

    const areDataCopied = ref(false)

    async function copyDataToClipboard() {

        const saveCode = gameStore.getEncryptedData()
        
        try {

            await navigator.clipboard.writeText(saveCode)
            areDataCopied.value = true
            
            setTimeout(() => { areDataCopied.value = false }, 2000)            
        }
        catch (err) {

            console.error("Impossible de copier dans le presse-papiers", err)
        }
    }

    const importInput = ref('')

    const importStatus = ref<'idle' | 'success' | 'error'>('idle')

    async function importData() {

        const success = await gameStore.importEncryptedData(importInput.value)
        
        if (success) {

            importStatus.value = 'success'
            importInput.value = ''
        }
        else {

            importStatus.value = 'error'
        }

        setTimeout(() => { importStatus.value = 'idle' }, 3000)
    }

    // Scenario tab

    function getDatasetName(datasetId: string): string {

        const found = gameStore.availableDatasets.find(d => d.id === datasetId)
        return found ? found.name : datasetId
    }

    // Item Modal

    const isItemOpen = ref(false)
    const selectedItem = ref<Item | null>(null)

    function openItemModal(item: Item) {

        selectedItem.value = item
        gameStore.markItemModalOpened(item.id)
        isItemOpen.value = true
    }

    watch(() => gameStore.hasWon, (newHasWon) => {

        if (newHasWon) {

            isItemOpen.value = false
            selectedItem.value = null
        }
    })

    const selectedItemBuildProgress = computed(() => {

        if (!selectedItem.value) return 0

        const task = gameStore.activeItemBuildings[selectedItem.value.id]
        if (!task) return 0

        const timeElapsed = task.totalTime - task.timeLeft
        const progressPercent = (timeElapsed / task.totalTime) * 100
        
        return Math.min(100, Math.max(0, progressPercent))
    })

</script>

<template>

    <!-- Loading Card -->

    <div v-if="gameStore.isLoading" class="flex flex-col items-center justify-center py-12">

        <UCard>
            <div class="flex flex-col space-y-4">

                <h1 class="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                    <UIcon name="i-lucide-factory" class="w-6 h-6 text-primary" />
                    FG Factory
                </h1>

                <UProgress size="sm" animation="carousel" class="w-64" />

            </div>
        </UCard>

    </div>

    <!-- Loading Error -->

    <div v-else-if="gameStore.loadingError" class="flex flex-col items-center justify-center py-12 gap-2">

        <UAlert color="error" variant="subtle" icon="i-lucide-alert-triangle"
            :title="gameStore.t('errors.title')" :description="gameStore.t(`errors.${gameStore.loadingError}`)" />

    </div>

    <!-- Main Screen -->

    <div v-else class="min-h-screen w-full flex flex-col">

		<!-- Page Header -->

        <UContainer class="fixed top-0 z-50 backdrop-blur bg-zinc-900/70 px-3">
            <div class="max-w-3xl mx-auto pt-2">
                    
                <header v-if="!gameStore.isLoading" class="flex justify-between gap-3">

                    <h1 class="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                        <UIcon name="i-lucide-factory" class="w-6 h-6 text-primary" />
                        {{ gameStore.customGameName || gameStore.t('title') }}
                    </h1>

                    <UButton color="primary" variant="ghost" icon="i-lucide-settings-2" square size="md"
                        @click="isOptionsOpen = true" />

                </header>

                <UTabs v-model="activeGroup" :items="groupTabs" 
                    variant="link" :ui="{ list: 'justify-center' }" />

            </div>
		</UContainer>

		<!-- Page Content -->

        <UContainer class="pt-[88px] flex-1 max-w-3xl mx-auto bg-zinc-900/70 px-3">

            <!-- Scenario Tab -->

            <div v-if="activeGroup === 'admin'" class="pt-2 flex flex-col space-y-4">
                
                <!-- Current Scenario -->

                <UCard>
                    <div class="flex flex-col space-y-4">

                        <div class="flex items-center gap-2">

                            <!-- Scenario Name -->

                            <div class="flex-1 flex flex-col gap-1">

                                <span class="text-xs font-semibold text-zinc-400">{{ gameStore.t('labels.current_scenario') }}</span>

								<div class="flex items-center flex-wrap gap-3">

									<UPopover>

										<UButton color="error" variant="subtle" icon="i-lucide-rotate-ccw" />

										<template #content>
											<UCard>
												<div class="flex flex-col items-center gap-4">

													<span class="w-48 text-center text-xs font-semibold text-error">{{ gameStore.t('labels.reset_confirm') }}</span>

													<UButton color="error" variant="subtle"
														@click="gameStore.resetGame()">
														{{ gameStore.t('labels.confirm') }}
													</UButton>

												</div>
											</UCard>
										</template>

									</UPopover>

	                                <h2 class="text-lg font-bold text-primary">{{ gameStore.t(getDatasetName(gameStore.currentDatasetId)) }}</h2>

								</div>

                            </div>

                            <!-- Scenario Play Time -->

                            <div class="flex-1 flex flex-col gap-1">
                                
                                <span class="text-xs font-semibold text-zinc-400">{{ gameStore.t('labels.play_time') }}</span>

                                <div class="flex items-center flex-wrap gap-3">

                                    <UButton variant="subtle"
                                        :color="gameStore.isPaused ? 'success' : 'primary'"                                
                                        :icon="gameStore.isPaused ? 'i-lucide-play-circle' : 'i-lucide-pause-circle'"
                                        @click="gameStore.togglePause()" />

                                    <h2 class="text-lg font-bold font-mono">{{ gameStore.formatTime(gameStore.totalPlayTime) }}</h2>

                                    <span class="text-xs font-semibold flex items-center gap-1.5" :class="gameStore.isPaused ? 'text-primary' : 'text-success'">
                                        <span class="h-2 w-2 rounded-full bg-current" :class="gameStore.isPaused ? '' : 'animate-ping'"></span>
                                        {{ gameStore.isPaused ? gameStore.t('labels.status_paused') : gameStore.t('labels.status_running') }}
                                    </span>

                                </div>
                                
                            </div>

                            <!-- Scenario Reset -->
                            
                        </div>
                        
                        <!-- Scenario Victory -->

                        <UAlert v-if="gameStore.isCurrentRunWon" variant="subtle" color="success" class="text-center" icon="i-lucide-award"
                            :description="gameStore.t('victory.message')" />

                    </div>
                </UCard>

                <!-- Available Scenarios -->

                <div class="flex flex-col space-y-2">

                    <h4 class="text-xs font-semibold text-zinc-400">{{ gameStore.t('labels.scenarios') }}</h4>

                    <UCard>
                        <div class="grid grid-cols-3 gap-3">

                            <UButton v-for="dataset in gameStore.availableDatasets" :key="dataset.id"
                                variant="subtle" :color="gameStore.currentDatasetId === dataset.id ? 'primary' : 'neutral'" class="justify-center"
                                :disabled="gameStore.currentDatasetId === dataset.id"
                                @click="gameStore.switchScenario(dataset.id)">
                                <span>{{ gameStore.t(dataset.name) }}</span>
                            </UButton>

                        </div>
                    </UCard>
                
                </div>

                <!-- Victories -->

                <div class="flex flex-col space-y-2">

                    <h4 class="text-xs font-semibold text-zinc-400">{{ gameStore.t('labels.victories') }}</h4>

                    <UCard>

                        <div v-if="gameStore.completedRuns && gameStore.completedRuns.length > 0" class="flex flex-col gap-2">
                            <div v-for="(run, index) in gameStore.completedRuns" :key="index"
                                class="border-zinc-800 flex justify-between items-center text-xs">

                                <div class="flex flex-col gap-1">
                                    <span class="text-sm font-bold text-gray-200">{{ getDatasetName(run.datasetId) }}</span>
                                    <span class="text-gray-400">{{ run.date }}</span>
                                </div>

                                <span class="font-bold bg-zinc-400/10 px-2 py-0.5 rounded">{{ gameStore.formatTime(run.timeSpent) }}</span>

                            </div>
                        </div>

                        <span v-else class="text-xs italic text-zinc-400">{{ gameStore.t('labels.no_victory') }}</span>

                    </UCard>
                
                </div>

            </div>

            <!-- Item Tab -->

            <div v-else class="pt-2 flex flex-col space-y-4">
                <div v-for="(subgroupItems, subgroupKey) in activeSubgroups" :key="subgroupKey"
                    class="flex flex-col space-y-4">

					<h3 class="text-xs text-center font-semibold text-gray-400">
						{{ gameStore.t(`subgroups.${subgroupKey}`) }}
					</h3>

                    <div class="flex justify-center gap-3">

                        <UButton v-for="item in subgroupItems" :key="item.id"
                            @click="openItemModal(item)"
                            color="neutral" variant="outline" class="w-14 relative aspect-square flex flex-col justify-center gap-1">

                            <img v-if="gameStore.isItemUnlocked(item)" :src="item.image" :alt="gameStore.t(`items.${item.id}`)" class="w-8 h-8" />
                            <UIcon v-else name="i-lucide-lock" class="w-8 h-8 text-gray-600" />

                            <UBadge v-if="gameStore.hasNewUnlock(item.id)" size="sm" color="primary" variant="solid"
                                class="absolute -top-1 -left-1 z-10 rounded-full px-1 justify-center">
                                <UIcon name="i-lucide-sparkles" class="w-2 h-2" />
                            </UBadge>
                            
                            <UIcon v-if="gameStore.activeItemBuildings[item.id]" name="i-lucide-hammer" class="absolute top-1 left-1 w-2 h-2 text-primary animate-spin" />

                            <UBadge v-if="gameStore.isItemUnlocked(item) && item.type === 'mission'" size="sm" :color="gameStore.isItemStorageFull(item.id) ? 'success' : 'neutral'" :variant="gameStore.isItemStorageFull(item.id) ? 'solid' : 'subtle'"
                                class="absolute -top-1 -right-1 font-bold shadow-sm z-10 rounded-full px-1.5 min-w-[20px] justify-center">
                                <UIcon name="i-lucide-check" class="w-2 h-2" />
                            </UBadge>

                            <UBadge v-else-if="gameStore.isItemUnlocked(item)" size="sm" color="neutral" variant="subtle"
                                class="absolute -top-1 -right-1 font-bold shadow-sm z-10 rounded-full px-1.5 min-w-[20px] justify-center">
                                <span :class="gameStore.isItemStorageFull(item.id) ? 'text-error' : ''">{{ gameStore.getItemStock(item.id) }}</span>
                            </UBadge>

                            <UBadge v-if="gameStore.isItemUnlocked(item) && item.recipes && item.recipes.length > 0" size="sm" color="neutral" variant="subtle"
                                class="absolute -bottom-1 -right-1 font-bold shadow-sm z-10 rounded-full px-1.5 min-w-[20px] justify-center">
                                <span :class="gameStore.getItemProds[item.id] > 0 ? 'text-success' : 'text-error'">{{ gameStore.getItemProds[item.id] > 0 ? '+' : '' }}{{ gameStore.getItemProds[item.id] }}</span>
                            </UBadge>

                            <UBadge v-if="gameStore.isItemUnlocked(item) && item.type === 'machine'" size="sm" color="neutral" variant="subtle"
                                class="absolute -bottom-1 -right-1 font-bold shadow-sm z-10 rounded-full px-1.5 min-w-[20px] justify-center">
                                <span :class="gameStore.getFreeMachineCount(item.id) > 0 ? 'text-success' : 'text-error'">{{ gameStore.getFreeMachineCount(item.id) }}</span>
                            </UBadge>

                            <UBadge v-if="gameStore.isItemUnlocked(item) && item.type === 'storer'" size="sm" color="neutral" variant="subtle"
                                class="absolute -bottom-1 -right-1 font-bold shadow-sm z-10 rounded-full px-1.5 min-w-[20px] justify-center">
                                <span :class="gameStore.getFreeStorerCount(item.id) > 0 ? 'text-success' : 'text-error'">{{ gameStore.getFreeStorerCount(item.id) }}</span>
                            </UBadge>

                        </UButton>

                    </div>

                </div>
            </div>

        </UContainer>

    </div>

    <!-- Options Modal -->

    <UModal v-model:open="isOptionsOpen">
        <template #content>
            <UCard :ui="{ body: 'sm:py-3 py-3' }">
            
                <template #header>
                    <div class="flex items-center justify-between">

                        <div class="flex items-center gap-3">
                            <UIcon name="i-lucide-settings-2" class="text-primary" />
                            <h3 class="text-lg font-bold text-white">{{ gameStore.t('options.title') }}</h3>
                        </div>

                        <UButton color="neutral" variant="ghost" icon="i-lucide-x"
                            @click="isOptionsOpen = false" />

                    </div>
                </template>

                <div class="flex flex-col space-y-4">

                    <!-- Language -->

                    <div class="flex flex-col space-y-2">

                        <h4 class="text-xs font-semibold text-zinc-400">{{ gameStore.t('options.language') }}</h4>

                        <UCard variant="subtle">
                            <div class="grid grid-cols-2 gap-3">

                                <UButton v-for="locale in gameStore.supportedLocales" :key="locale.value"
                                    variant="subtle" :color="gameStore.currentLocale === locale.value ? 'primary' : 'neutral'" class="justify-center"
                                    @click="gameStore.currentLocale = locale.value">

                                    <div class="flex items-center gap-3">
                                        <img :src="locale.flag" :alt="locale.label"  class="w-6 h-6" />
                                        <span>{{ locale.label }}</span>
                                    </div>
                                    
                                </UButton>

                            </div>

                        </UCard>

                    </div>
                
                    <!-- Game Name -->

                    <div class="flex flex-col space-y-2">

                        <h4 class="text-xs font-semibold text-zinc-400">{{ gameStore.t('options.game_name') }}</h4>

                        <UCard variant="subtle">

                            <UInput v-model="gameStore.customGameName" block
                                :placeholder="gameStore.t('options.game_name_placeholder')"
                                class="w-full" />

                        </UCard>

                    </div>

                     <!-- Local Storage -->

                    <div class="flex flex-col space-y-2">

                        <h4 class="text-xs font-semibold text-zinc-400">{{ gameStore.t('options.local_storage') }}</h4>

                        <UCard variant="subtle">
                            <div class="flex flex-col space-y-2">

                                <div class="grid grid-cols-2 gap-3">

                                    <!-- Wipe Data -->

                                    <UPopover>

                                        <UButton block color="error" variant="subtle" icon="i-lucide-trash-2">
                                            {{ gameStore.t('options.wipe') }}
                                        </UButton>

                                        <template #content>
                                            <UCard>
                                                <div class="flex flex-col items-center gap-4">

                                                    <span class="w-48 text-center text-xs font-semibold text-error">{{ gameStore.t('options.wipe_confirm') }}</span>

                                                    <UButton color="error" variant="subtle"
                                                        @click="() => { gameStore.wipeLocalStorage(); isOptionsOpen = false; }">
                                                        {{ gameStore.t('labels.confirm') }}
                                                    </UButton>

                                                </div>
                                            </UCard>
                                        </template>

                                    </UPopover>

                                    <!-- Export Data -->

                                    <UButton block variant="subtle"
                                        :color="areDataCopied ? 'success' : 'primary'"                                        
                                        :icon="areDataCopied ? 'i-lucide-check' : 'i-lucide-clipboard-copy'"
                                        @click="copyDataToClipboard">
                                        {{ areDataCopied ? gameStore.t('options.copied') : gameStore.t('options.export') }}
                                    </UButton>

                                </div>

                                <!-- Import Data -->

                                <UTextarea v-model="importInput" :rows="3" autoresize block
                                    :placeholder="gameStore.t('options.import_placeholder')"                                        
                                    class="mt-4 text-xs" />

                                <UButton block variant="subtle"
                                    :color="importStatus === 'success' ? 'success' : importStatus === 'error' ? 'error' : 'primary'"                                        
                                    :icon="importStatus === 'success' ? 'i-lucide-check' : importStatus === 'error' ? 'i-lucide-alert-triangle' : 'i-lucide-download'"
                                    :disabled="!importInput.trim()"
                                    @click="importData">
                                    {{ 
                                        importStatus === 'success' ? gameStore.t('options.import_success') : 
                                        importStatus === 'error' ? gameStore.t('options.import_error') : 
                                        gameStore.t('options.import') 
                                    }}
                                </UButton>

                            </div>
                        </UCard>

                    </div>

                </div>

            </UCard>
        </template>
    </UModal>

    <!-- Item Modal -->

    <UModal v-model:open="isItemOpen" scrollable>
        <template #content>
            <UCard v-if="selectedItem" :ui="{ body: 'sm:py-3 py-3' }">

                <template #header>
                    <div class="flex items-center justify-between">

                        <div class="flex items-center gap-3">

                            <img v-if="gameStore.isItemUnlocked(selectedItem)" :src="selectedItem.image" :alt="gameStore.t(`items.${selectedItem.id}`)"  class="w-6 h-6" />
                            <UIcon v-else name="i-lucide-lock" class="w-6 h-6 text-gray-600" />

                            <h3 class="text-lg font-bold text-white">{{ gameStore.t(`items.${selectedItem.id}`) }}</h3>

                        </div>

                        <UButton color="neutral" variant="ghost" icon="i-lucide-x" 
                            @click="isItemOpen = false" />

                    </div>
                </template>

                <div class="flex flex-col space-y-4">

                    <!-- Item Requirements -->

                    <div v-if="!gameStore.isItemUnlocked(selectedItem)" class="flex flex-col space-y-2">

                        <h4 class="text-xs italic text-zinc-500">{{ gameStore.t('labels.requirements') }}</h4>

                        <UCard variant="subtle">
                            <div class="flex flex-col space-y-1">
                                <div v-for="req in selectedItem.requires" :key="req.id" class="flex items-center justify-between text-xs">

                                    <div class="flex items-center space-x-2">
                                        <img :src="gameStore.getItemImage(req.id)" :alt="gameStore.t(`items.${req.id}`)" class="w-4 h-4" />
                                        <span>{{ gameStore.t(`items.${req.id}`) }}</span>
                                    </div>

                                    <span :class="gameStore.getItemStock(req.id) >= req.quantity ? 'text-success' : 'text-error'">{{ gameStore.getItemStock(req.id) }} / {{ req.quantity }}</span>

                                </div>
                            </div>
                        </UCard>

                    </div>

                    <!-- Mission Completed -->

                    <UBadge v-if="gameStore.isItemUnlocked(selectedItem) && selectedItem.type == 'mission' && gameStore.isItemStorageFull(selectedItem.id)"
                        variant="subtle" size="lg" color="success" class="w-full px-4 py-2 flex justify-center">
                        <UIcon name="i-lucide-award" class="w-4 h-4" />
                        <span>{{ gameStore.t('labels.mission_completed') }}</span>
                    </UBadge>

                    <!-- Item Stock & Production -->

                    <div v-else-if="gameStore.isItemUnlocked(selectedItem) && selectedItem.type != 'mission'" class="grid grid-cols-2 gap-3">

                        <UCard variant="subtle">
                            <div class="flex flex-col space-y-1">

                                <span class="text-xs font-semibold text-zinc-400">{{ gameStore.t('labels.stock') }}</span>

                                <div class="text-xs">
                                    <span :class="gameStore.getItemStock(selectedItem.id) >= gameStore.getItemStorages[selectedItem.id] ? 'text-xl text-error' : 'text-xl'">{{ gameStore.getItemStock(selectedItem.id) }}{{ gameStore.getItemStorages[selectedItem.id] !== Infinity ? ' / ' + gameStore.getItemStorages[selectedItem.id] : '' }}</span>
                                </div>

                            </div>
                        </UCard>

                        <UCard v-if="selectedItem.type === 'item'" variant="subtle">
                            <div class="flex flex-col space-y-1">

                                <span class="text-xs font-semibold text-zinc-400">{{ gameStore.t('labels.production') }}</span>

                                <div class="text-xs">
                                    <span :class="gameStore.getItemProds[selectedItem.id] > 0 ? 'text-xl text-success' : 'text-xl text-error'">{{ gameStore.getItemProds[selectedItem.id] > 0 ? '+' : '' }}{{ gameStore.getItemProds[selectedItem.id] }} <small>{{ gameStore.t('labels.per_cycle') }}</small></span>
                                </div>

                            </div>
                        </UCard>

                        <UCard v-else-if="selectedItem.type === 'machine'" variant="subtle">
                            <div class="flex flex-col space-y-1">

                                <span class="text-xs font-semibold text-zinc-400">{{ gameStore.t('labels.available') }}</span>

                                <div class="text-xs">
                                    <span :class="gameStore.getFreeMachineCount(selectedItem.id) > 0 ? 'text-xl text-success' : 'text-xl text-error'">{{ gameStore.getFreeMachineCount(selectedItem.id) }}</span>
                                </div>

                            </div>
                        </UCard>

                        <UCard v-else-if="selectedItem.type === 'storer'" variant="subtle">
                            <div class="flex flex-col space-y-1">

                                <span class="text-xs font-semibold text-zinc-400">{{ gameStore.t('labels.available') }}</span>

                                <div class="text-xs">
                                    <span :class="gameStore.getFreeStorerCount(selectedItem.id) > 0 ? 'text-xl text-success' : 'text-xl text-error'">{{ gameStore.getFreeStorerCount(selectedItem.id) }}</span>
                                </div>

                            </div>
                        </UCard>

                    </div>

                    <!-- Item Recipes -->

                    <div v-if="gameStore.isItemUnlocked(selectedItem) && selectedItem.recipes && selectedItem.recipes.length > 0" class="flex flex-col space-y-2">

                        <h4 class="text-xs italic text-zinc-500">{{ gameStore.t('labels.production') }}</h4>

                        <UCard variant="subtle">
                            <div class="flex flex-col space-y-2">
								<div v-for="(recipe, index) in selectedItem.recipes" :key="index">

									<!-- Machine assignment -->

									<div v-if="gameStore.isRecipeUnlocked(recipe)" class="grid grid-cols-2 gap-3 text-xs items-start">

										<div class="flex items-center gap-2">

											<!-- Recipe Inputs & Outputs -->

											<UPopover :content="{ align: 'start' }">
												
												<UButton color="neutral" variant="soft" icon="i-lucide-info" size="xs" class="text-gray-400" />

												<template #content>
													<UCard>
														<div class="grid grid-cols-2 gap-3 text-xs items-start">

															<div class="flex flex-col space-y-2">

																<span class="text-xs font-semibold text-zinc-400">{{ gameStore.t('labels.inputs') }}</span>

																<div v-if="recipe.inputs && recipe.inputs.length > 0" class="flex flex-col space-y-1">
																	<UButton v-for="input in recipe.inputs" :key="input.id" color="neutral" variant="soft" size="xs" class="justify-between gap-4"
																		@click="openItemModal(gameStore.getItemById(input.id))">
																		<div class="flex items-center gap-2">
																			<img :src="gameStore.getItemImage(input.id)" :alt="gameStore.t(`items.${input.id}`)" class="w-4 h-4" />
																			<span class="truncate">{{ gameStore.t(`items.${input.id}`) }}</span>
																		</div>
																		<span :class="gameStore.getItemProds[input.id] >= input.rate ? 'text-success' : 'text-error'">{{ input.rate }} <small>{{ gameStore.t('labels.per_cycle') }}</small></span>
																	</UButton>
																</div>

																<div v-else class="text-xs text-zinc-400 italic">
																	<span class="text-xs italic text-zinc-500">{{ gameStore.t('labels.no_input') }}</span>
																</div>

															</div>

															<div class="flex flex-col space-y-2">

																<span class="text-gray-400 font-medium">{{ gameStore.t('labels.outputs') }}</span>

																<div class="flex flex-col space-y-1">
																	<UButton v-for="output in recipe.outputs" :key="output.id" color="neutral" variant="soft" size="xs" class="justify-between gap-4"
																		@click="openItemModal(gameStore.getItemById(output.id))">
																		<div class="flex items-center gap-2">
																			<img :src="gameStore.getItemImage(output.id)" :alt="gameStore.t(`items.${output.id}`)" class="w-4 h-4" />
																			<span class="truncate">{{ gameStore.t(`items.${output.id}`) }}</span>
																		</div>
																		<span class="text-success">{{ output.rate }} <small>{{ gameStore.t('labels.per_cycle') }}</small></span>
																	</UButton>
																</div>

															</div>

														</div>
													</UCard>
												</template>

											</UPopover>

											<UButton color="neutral" variant="soft" size="xs" class="flex-1 flex justify-start gap-2"
												@click="openItemModal(gameStore.getItemById(recipe.machineId))">
												<img :src="gameStore.getItemImage(recipe.machineId)" :alt="gameStore.t(`items.${recipe.machineId}`)" class="w-4 h-4" />
												<span class="truncate">{{ gameStore.t(`items.${recipe.machineId}`) }}</span>
												<span :class="gameStore.getFreeMachineCount(recipe.machineId) > 0 ? 'text-success' : 'text-error'">{{ gameStore.getFreeMachineCount(recipe.machineId) }}</span>
											</UButton>

										</div>
										
										<UFieldGroup size="xs" class="ms-auto">

											<UButton color="error" variant="subtle" icon="i-lucide-minus"
												:disabled="!gameStore.canUnassignMachine(selectedItem.id, recipe.machineId, recipe)"
												@click="gameStore.changeMachineAssignment(selectedItem.id, recipe.machineId, recipe, -1)" />

											<UBadge color="neutral" variant="subtle" class=" text-xs w-12 justify-center">
												{{ gameStore.getAssignedMachineCount(selectedItem.id, recipe.machineId) }}
											</UBadge>

											<UButton color="primary" variant="subtle" icon="i-lucide-plus"
												:disabled="!gameStore.canAssignMachine(recipe.machineId, recipe)"
												@click="gameStore.changeMachineAssignment(selectedItem.id, recipe.machineId, recipe, 1)" />

										</UFieldGroup>

									</div>

									<!-- Recipe Locked -->

									<div v-else class="flex items-center gap-2 text-xs text-zinc-400">
										<UIcon name="i-lucide-lock" class="w-4 h-4" />
										<span>{{ gameStore.t(`items.${recipe.machineId}`) }}</span>
									</div>                                
								
								</div>
                            </div>
                        </UCard>

                    </div>
                    
                    <!-- Item Storages -->

                    <div v-if="gameStore.isItemUnlocked(selectedItem) && selectedItem.storages && selectedItem.storages.length > 0" class="flex flex-col space-y-2">

                        <h4 class="text-xs italic text-zinc-500">{{ gameStore.t('labels.storage') }}</h4>

                        <UCard variant="subtle">
                            <div class="flex flex-col space-y-2">
								<div v-for="(storage, index) in selectedItem.storages" :key="index">

									<!-- Storer assignment -->

									<div v-if="gameStore.isStorageUnlocked(storage)" class="grid grid-cols-2 gap-3 text-xs items-start">

										<div class="flex items-center gap-2">

											<!-- Storage -->

											<UPopover :content="{ align: 'start' }">
												
												<UButton color="neutral" variant="soft" icon="i-lucide-info" size="xs" class="text-gray-400" />

												<template #content>
													<UCard>
														<div class="flex flex-col space-y-2">

															<span class="text-xs font-semibold text-zinc-400">{{ gameStore.t('labels.storage') }}</span>

															<UButton color="neutral" variant="soft" size="xs" class="justify-between gap-4"
																@click="openItemModal(gameStore.getItemById(storage.itemId))">
																<div class="flex items-center gap-2">
																	<img :src="gameStore.getItemImage(storage.itemId)" :alt="gameStore.t(`items.${storage.itemId}`)" class="w-4 h-4" />
																	<span class="truncate">{{ gameStore.t(`items.${storage.itemId}`) }}</span>
																</div>
																<span class="text-success">+{{ storage.stock }}</span>
															</UButton>

														</div>
													</UCard>
												</template>

											</UPopover>

											<UButton color="neutral" variant="soft" size="xs" class="flex-1 flex justify-start gap-2"
												@click="openItemModal(gameStore.getItemById(storage.storerId))">
												<img :src="gameStore.getItemImage(storage.storerId)" :alt="gameStore.t(`items.${storage.storerId}`)" class="w-4 h-4" />
												<span class="truncate">{{ gameStore.t(`items.${storage.storerId}`) }}</span>
												<span :class="gameStore.getFreeStorerCount(storage.storerId) > 0 ? 'text-success' : 'text-error'">{{ gameStore.getFreeStorerCount(storage.storerId) }}</span>
											</UButton>

										</div>
										
										<UFieldGroup size="xs" class="ms-auto">

											<UButton color="error" variant="subtle" icon="i-lucide-minus"
												:disabled="!gameStore.canUnassignStorer(selectedItem.id, storage.storerId)"
												@click="gameStore.changeStorerAssignment(selectedItem.id, storage.storerId, -1)" />

											<UBadge color="neutral" variant="subtle" class=" text-xs w-12 justify-center">
												{{ gameStore.getAssignedStorerCount(selectedItem.id, storage.storerId) }}
											</UBadge>

											<UButton color="primary" variant="subtle" icon="i-lucide-plus"
												:disabled="!gameStore.canAssignStorer(storage.storerId, selectedItem.id)"
												@click="gameStore.changeStorerAssignment(selectedItem.id, storage.storerId, 1)" />

										</UFieldGroup>

									</div>

									<!-- Storage Locked -->

									<div v-else class="flex items-center gap-2 text-xs text-zinc-400">
										<UIcon name="i-lucide-lock" class="w-4 h-4" />
										<span>{{ gameStore.t(`items.${storage.storerId}`) }}</span>
									</div>                                

								</div>
                            </div>
                        </UCard>

                    </div>

                    <!-- Item Crafting -->

                    <div v-if="gameStore.isItemUnlocked(selectedItem) && selectedItem.purchase" class="flex flex-col space-y-2">

                        <h4 v-if="selectedItem.type !== 'mission'" class="text-xs italic text-zinc-500">{{ gameStore.t('labels.crafting') }}</h4>

                        <UCard variant="subtle">

                            <div class="grid grid-cols-2 gap-3 text-xs items-end">
                                
                                <!-- Building Costs -->

                                <div class="flex flex-col space-y-2">

                                    <span v-if="selectedItem.type === 'mission'" class="text-xs font-semibold text-zinc-400">{{ gameStore.t('labels.objectives') }}</span>
                                    <span v-else class="text-xs font-semibold text-zinc-400">{{ gameStore.t('labels.costs') }}</span>

                                    <div v-if="selectedItem.purchase.costs && selectedItem.purchase.costs.length > 0" class="flex flex-col space-y-2">
                                        <UButton v-for="cost in selectedItem.purchase.costs" :key="cost.id" color="neutral" variant="soft" size="xs" class="justify-between gap-4"
                                            @click="openItemModal(gameStore.getItemById(cost.id))">
											<div class="flex items-center gap-2">
												<img :src="gameStore.getItemImage(cost.id)" :alt="gameStore.t(`items.${cost.id}`)" class="w-4 h-4" />
												<span class="truncate">{{ gameStore.t(`items.${cost.id}`) }}</span>
											</div>
                                            <span :class="gameStore.getItemStock(cost.id) >= cost.quantity ? 'text-success' : 'text-error'">{{ cost.quantity }}</span>
                                        </UButton>
                                    </div>

                                    <div v-else class="text-xs text-zinc-400 italic">
                                        <span class="text-xs italic text-zinc-500">{{ gameStore.t('labels.no_cost') }}</span>
                                    </div>

                                </div>

                                <!-- Building Progress -->

                                <div class="flex items-center justify-end gap-3">

                                    <div v-if="selectedItem.purchase.time > 0" class="flex-auto flex flex-col gap-1">

                                        <div class="flex items-center justify-between gap-2">
                                            <span class="text-xs text-zinc-400">{{ gameStore.activeItemBuildings[selectedItem.id] ? gameStore.formatTime(gameStore.activeItemBuildings[selectedItem.id].timeLeft) : gameStore.formatTime(selectedItem.purchase.time) }}</span>
                                            <span class="text-success">+{{ selectedItem.purchase.output }}</span>
                                        </div>

                                        <UProgress v-model="selectedItemBuildProgress" size="sm" color="primary" class="flex-1" />

                                    </div>
                                    
                                    <UButton v-if="selectedItem.type === 'mission' && gameStore.isItemStorageFull(selectedItem.id)"
                                        color="success" variant="subtle" icon="i-lucide-check" square size="md"
                                        :disabled="true"
                                        @click="gameStore.startItemBuilding(selectedItem)" />

                                    <UButton v-else-if="selectedItem.type === 'mission' && !gameStore.isItemStorageFull(selectedItem.id)"
                                        color="primary" variant="subtle" icon="i-lucide-check" square size="md"
                                        :disabled="!gameStore.canBuildItem(selectedItem)"
                                        @click="gameStore.startItemBuilding(selectedItem)" />

                                    <UButton v-else-if="gameStore.activeItemBuildings[selectedItem.id]"
                                        color="error" variant="subtle" icon="i-lucide-square" square size="md"
                                        @click="gameStore.cancelItemBuilding(selectedItem.id)" />

                                    <UButton v-else
                                        color="primary" variant="subtle" icon="i-lucide-play" square size="md"
                                        :disabled="!gameStore.canBuildItem(selectedItem) || gameStore.isItemStorageFull(selectedItem.id)"
                                        @click="gameStore.startItemBuilding(selectedItem)" />

                                </div>

                            </div>

                        </UCard>

                    </div>

                    <!-- Machine Assignments -->

                    <div v-if="gameStore.isItemUnlocked(selectedItem) && selectedItem.type === 'machine'" class="flex flex-col space-y-2">

                        <h4 class="text-xs italic text-zinc-500">{{ gameStore.t('labels.assignments') }}</h4>
                        
                        <UCard variant="subtle">
                            <div class="flex flex-col space-y-2">
                                <div v-for="(recipe, index) in gameStore.getRecipesByMachine(selectedItem.id)" :key="index">

                                    <!-- Machine assignment -->

                                    <div v-if="gameStore.isRecipeUnlocked(recipe)" class="grid grid-cols-2 gap-3 text-xs items-start">

                                        <div class="flex items-center gap-2">

                                            <!-- Recipe Inputs & Outputs -->

                                            <UPopover :content="{ align: 'start' }">
                                                
                                                <UButton color="neutral" variant="soft" icon="i-lucide-info" size="xs" class="text-gray-400" />

                                                <template #content>
                                                    <UCard>
                                                        <div class="grid grid-cols-2 gap-3 text-xs items-start">

                                                            <div class="flex flex-col space-y-2">

                                                                <span class="text-xs font-semibold text-zinc-400">{{ gameStore.t('labels.inputs') }}</span>

                                                                <div v-if="recipe.inputs && recipe.inputs.length > 0" class="flex flex-col space-y-1">
                                                                    <UButton v-for="input in recipe.inputs" :key="input.id" color="neutral" variant="soft" size="xs" class="justify-between gap-4"
                                                                        @click="openItemModal(gameStore.getItemById(input.id))">
																		<div class="flex align-items gap-2">
																			<img :src="gameStore.getItemImage(input.id)" :alt="gameStore.t(`items.${input.id}`)" class="w-4 h-4" />
																			<span class="truncate">{{ gameStore.t(`items.${input.id}`) }}</span>
																		</div>
                                                                        <span :class="gameStore.getItemProds[input.id] >= input.rate ? 'text-success' : 'text-error'">{{ input.rate }} <small>{{ gameStore.t('labels.per_cycle') }}</small></span>
                                                                    </UButton>
                                                                </div>

                                                                <div v-else class="text-xs text-zinc-400 italic">
                                                                    <span class="text-xs italic text-zinc-500">{{ gameStore.t('labels.no_input') }}</span>
                                                                </div>

                                                            </div>

                                                            <div class="flex flex-col space-y-2">

                                                                <span class="text-gray-400 font-medium">{{ gameStore.t('labels.outputs') }}</span>

                                                                <div class="flex flex-col space-y-1">
                                                                    <UButton v-for="output in recipe.outputs" :key="output.id" color="neutral" variant="soft" size="xs" class="justify-between gap-4"
                                                                        @click="openItemModal(gameStore.getItemById(output.id))">
																		<div class="flex align-items gap-2">
																			<img :src="gameStore.getItemImage(output.id)" :alt="gameStore.t(`items.${output.id}`)" class="w-4 h-4" />
																			<span class="truncate">{{ gameStore.t(`items.${output.id}`) }}</span>
																		</div>
                                                                        <span class="text-success">{{ output.rate }} <small>{{ gameStore.t('labels.per_cycle') }}</small></span>
                                                                    </UButton>
                                                                </div>

                                                            </div>

                                                        </div>
                                                    </UCard>
                                                </template>

                                            </UPopover>

                                            <UButton color="neutral" variant="soft" size="xs" class="flex-1 flex justify-between gap-4"
                                                @click="openItemModal(gameStore.getItemById(recipe.outputs[0].id))">
												<div class="flex items-center gap-2">
													<img :src="gameStore.getItemImage(recipe.outputs[0].id)" :alt="gameStore.t(`items.${recipe.outputs[0].id}`)" class="w-4 h-4" />
													<span class="truncate">{{ gameStore.t(`items.${recipe.outputs[0].id}`) }}</span>
												</div>
                                                <span :class="gameStore.getItemProds[recipe.outputs[0].id] > 0 ? 'text-success' : 'text-error'">{{ gameStore.getItemProds[recipe.outputs[0].id] > 0 ? '+' : '' }}{{ gameStore.getItemProds[recipe.outputs[0].id] }}</span>
                                            </UButton>

                                        </div>
                                        
                                        <UFieldGroup size="xs" class="ms-auto">

                                            <UButton color="error" variant="subtle" icon="i-lucide-minus"
                                                :disabled="!gameStore.canUnassignMachine(recipe.outputs[0].id, recipe.machineId, recipe)"
                                                @click="gameStore.changeMachineAssignment(recipe.outputs[0].id, recipe.machineId, recipe, -1)" />

                                            <UBadge color="neutral" variant="subtle" class=" text-xs w-12 justify-center">
                                                {{ gameStore.getAssignedMachineCount(recipe.outputs[0].id, recipe.machineId) }}
                                            </UBadge>

                                            <UButton color="primary" variant="subtle" icon="i-lucide-plus"
                                                :disabled="!gameStore.canAssignMachine(recipe.machineId, recipe)"
                                                @click="gameStore.changeMachineAssignment(recipe.outputs[0].id, recipe.machineId, recipe, 1)" />

                                        </UFieldGroup>

                                    </div>

                                    <!-- Recipe Locked -->

                                    <div v-else class="flex items-center gap-2 text-xs text-zinc-400">
                                        <UIcon name="i-lucide-lock" class="w-4 h-4" />
                                        <span>{{ gameStore.t(`items.${recipe.outputs[0].id}`) }}</span>
                                    </div>

                                </div>
                            </div>
                        </UCard>

                    </div>

                    <!-- Storer Assignments -->

                    <div v-if="gameStore.isItemUnlocked(selectedItem) && selectedItem.type === 'storer'" class="flex flex-col space-y-2">

                        <h4 class="text-xs italic text-zinc-500">{{ gameStore.t('labels.assignments') }}</h4>
                        
                        <UCard variant="subtle">
                            <div class="flex flex-col space-y-2">
                                <div v-for="(storage, index) in gameStore.getStoragesByStorer(selectedItem.id)" :key="index">

                                    <!-- Storer assignment -->

                                    <div v-if="gameStore.isStorageUnlocked(storage)" class="grid grid-cols-2 gap-3 text-xs items-start">

                                        <div class="flex items-center gap-2">

                                            <!-- Storage Info -->

                                            <UPopover :content="{ align: 'start' }">
                                                
                                                <UButton color="neutral" variant="soft" icon="i-lucide-info" size="xs" class="text-gray-400" />

                                                <template #content>
                                                    <UCard>
                                                        <div class="flex flex-col space-y-2">

                                                            <span class="text-xs font-semibold text-zinc-400">{{ gameStore.t('labels.storage') }}</span>

                                                            <UButton color="neutral" variant="soft" size="xs" class="justify-between gap-4"
                                                                @click="openItemModal(gameStore.getItemById(storage.itemId))">
																<div class="flex items-center gap-2">
																	<img :src="gameStore.getItemImage(storage.itemId)" :alt="gameStore.t(`items.${storage.itemId}`)" class="w-4 h-4" />
																	<span class="truncate">{{ gameStore.t(`items.${storage.itemId}`) }}</span>
																</div>
                                                                <span>+{{ storage.stock }}</span>
                                                            </UButton>

                                                        </div>
                                                    </UCard>
                                                </template>

                                            </UPopover>

                                            <UButton color="neutral" variant="soft" size="xs" class="flex-1 flex justify-between gap-4"
                                                @click="openItemModal(gameStore.getItemById(storage.itemId))">
												<div class="flex items-center gap-2">
													<img :src="gameStore.getItemImage(storage.itemId)" :alt="gameStore.t(`items.${storage.itemId}`)" class="w-4 h-4" />
													<span class="truncate">{{ gameStore.t(`items.${storage.itemId}`) }}</span>
												</div>
                                                <span class="text-success">{{ gameStore.getItemStorages[storage.itemId] }}</span>
                                            </UButton>

                                        </div>
                                        
                                        <UFieldGroup size="xs" class="ms-auto">

                                            <UButton color="error" variant="subtle" icon="i-lucide-minus"
                                                :disabled="!gameStore.canUnassignStorer(storage.itemId, storage.storerId)"
                                                @click="gameStore.changeStorerAssignment(storage.itemId, storage.storerId, -1)" />

                                            <UBadge color="neutral" variant="subtle" class=" text-xs w-12 justify-center">
                                                {{ gameStore.getAssignedStorerCount(storage.itemId, storage.storerId) }}
                                            </UBadge>

                                            <UButton color="primary" variant="subtle" icon="i-lucide-plus"
                                                :disabled="!gameStore.canAssignStorer(storage.storerId, storage.itemId)"
                                                @click="gameStore.changeStorerAssignment(storage.itemId, storage.storerId, 1)" />

                                        </UFieldGroup>

                                    </div>

                                    <!-- Storage Locked -->

                                    <div v-else class="flex items-center gap-2 text-xs text-zinc-400">
                                        <UIcon name="i-lucide-lock" class="w-4 h-4" />
                                        <span>{{ gameStore.t(`items.${storage.itemId}`) }}</span>
                                    </div>

                                </div>
                            </div>
                        </UCard>

                    </div>

                </div>

            </UCard>
        </template>
    </UModal>

    <!-- Victory Modal -->

    <UModal v-model:open="gameStore.hasWon" prevent-close>
        <template #content>
            <UCard :ui="{ body: 'sm:py-3 py-3' }">

                <template #header>
                    <div class="flex items-center justify-center gap-3">
                        <UIcon name="i-lucide-award" class="text-primary" />
                        <h3 class="text-lg font-bold text-white">{{ gameStore.t('victory.title') }}</h3>
                    </div>
                </template>

                <div class="flex flex-col space-y-4">

                    <UAlert variant="subtle" color="success" class="text-center"
                        :description="gameStore.t('victory.message')" />

                    <UCard variant="subtle">
                        <div class="flex justify-between items-center text-xs">

                            <div class="flex flex-col gap-1">
                                <span class="text-sm font-bold text-gray-200">{{ gameStore.currentDatasetId }}</span>
                                <span class="text-gray-400"><NuxtTime :datetime="new Date()" day="numeric" month="long" year="numeric" /></span>
                            </div>

                            <span class="font-bold bg-zinc-400/10 px-2 py-0.5 rounded">{{ gameStore.formatTime(gameStore.totalPlayTime) }}</span>

                        </div>
                    </UCard>

                    <div class="flex justify-center">
                        <UButton color="primary" variant="subtle"
                            @click="gameStore.hasWon = false">
                            {{ gameStore.t('victory.close') }}
                        </UButton>
                    </div>

                </div>

            </UCard>
        </template>
    </UModal>

</template>