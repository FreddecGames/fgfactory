<!-- ./app/layouts/default.vue -->

<script setup lang="ts">

	import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

	import { useGameStore } from '~/stores/game'

	const route = useRoute()
	const gameStore = useGameStore()
	const localePath = useLocalePath()

	const { locales, setLocale, localeProperties } = useI18n()

	let animationFrameId: number | null = null
	let lastTimestamp = 0

	const scheduleNextTick = () => {

		if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
		animationFrameId = requestAnimationFrame(runGameLoop)
	}

	const runGameLoop = (timestamp: number) => {

		if (gameStore.isPaused || gameStore.items.length === 0) {

			lastTimestamp = 0
			animationFrameId = null
			
			return
		}

		if (!lastTimestamp) lastTimestamp = timestamp

		let deltaSeconds = (timestamp - lastTimestamp) / 1000
		lastTimestamp = timestamp

		if (deltaSeconds > 1.0) deltaSeconds = 1.0

		gameStore.processGameTick(deltaSeconds)

		scheduleNextTick()
	}

	const activeTab = computed(() => {

		const pathSegments = route.path.split('/').filter(Boolean)
		const currentPage = pathSegments[pathSegments.length - 1]

		return currentPage === 'missions' || currentPage === 'machines' || currentPage === 'items'
			? currentPage
			: 'missions'
	})

	const tabs = [

		{ label:$t('tabs.missions'), value:'missions', icon:'i-lucide-target' },
		{ label:$t('tabs.items'), value:'items', icon:'i-lucide-boxes' },
		{ label:$t('tabs.machines'), value:'machines', icon:'i-lucide-wrench' },
	]

	const navigateToTab = (tab: string) => {
		const path = tab === 'missions' ? '/' : `/${tab}`
		return navigateTo(localePath(path))
	}

	const isLoading = ref<boolean>(true)
	const loadingError = ref<string | null>(null)

	watch(() => gameStore.isPaused, (isPaused) => {
		if (!isPaused && animationFrameId === null) {
			scheduleNextTick()
		}
	})

	onMounted(async () => {

		isLoading.value = true
		loadingError.value = null

		try {

			await gameStore.loadLocalData()
		
			scheduleNextTick()

			gameStore.startAutoSave(30000)
		}
		catch (err: any) {

			loadingError.value = err.message
			console.error(err)
		}
		finally {

			isLoading.value = false
		}
	})

	onBeforeUnmount(() => {

		gameStore.stopAutoSave()

		cancelAnimationFrame(animationFrameId)
	})
	
	const isOptionsOpen = ref<boolean>(false)

 	const areDataCopied = ref(false)

    async function copyDataToClipboard() {

        const saveCode = gameStore.getEncryptedData()
        
        try {

            await navigator.clipboard.writeText(saveCode)
            areDataCopied.value = true
            
            setTimeout(() => { areDataCopied.value = false }, 2000)            
        }
        catch (err) {

            console.error($t('options.export_error'), err)
        }
    }

    const importInput = ref('')

    const importStatus = ref<'idle' | 'success' | 'error'>('idle')

    async function importData() {

        const success = await gameStore.importLocalData(importInput.value)
        
        if (success) {

            importStatus.value = 'success'
            importInput.value = ''
        }
        else {

            importStatus.value = 'error'
        }

        setTimeout(() => { importStatus.value = 'idle' }, 3000)
    }
	
	const isScenariosOpen = ref<boolean>(false)

	const isVictoryOpen = ref<boolean>(false)

    watch(() => gameStore.hasWon, (newHasWon) => {

        if (!gameStore.hasWon && newHasWon)
            isVictoryOpen.value = true
    })

</script>

<template>
	<div class="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">

		<!-- Loading Card -->
		<div v-if="isLoading" class="flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center">
			<UCard :ui="{ 'body': 'p-3 sm:p-3 max-w-md' }">
				<div class="flex flex-col space-y-3 items-center">

					<h1 class="text-xl font-bold text-white flex items-center justify-center gap-2">
						<UIcon name="i-lucide-factory" class="w-6 h-6 text-primary" />
						{{ $t('gameName') }}
					</h1>

					<UProgress size="xs" animation="carousel" class="w-64" />

				</div>
			</UCard>
		</div>

		<!-- Error Screen -->
		<div v-else-if="loadingError" class="flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center">
			<UCard :ui="{ 'body': 'p-3 sm:p-3 max-w-md' }">
				<div class="flex flex-col space-y-3 items-center">

					<div class="flex flex-col space-y-1">
						<UIcon name="i-lucide-alert-triangle" class="w-12 h-12 text-error mx-auto" />
						<h2 class="text-lg font-semibold text-white">{{ $t('loading.error') }}</h2>
						<p class="text-sm text-error italic">"{{ loadingError }}"</p>
					</div>

					<UButton color="error" variant="subtle" block @click="gameStore.wipeLocalData()">
						{{ $t('loading.error_button') }}
					</UButton>

				</div>
			</UCard>
		</div>

		<!-- Main Screen -->
		<main v-else class="flex-1 flex flex-col">

			<!-- Page Header -->
			<div class="fixed top-0 z-50 w-full">
				<UContainer class="sm:px-3 lg:px-3 backdrop-blur max-w-3xl mx-auto bg-neutral-900/70 px-3">

					<header class="pt-2 flex justify-between gap-3">

						<h1 class="text-xl font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-2">
							<UIcon name="i-lucide-factory" class="w-6 h-6 text-primary" />
							{{ $t('gameName') }}
						</h1>

						<div class="flex items-center gap-3">

							<UButton color="primary" variant="ghost" icon="i-lucide-settings" square size="md"
								@click="isOptionsOpen = true" />

							<UButton color="primary" variant="ghost" icon="i-lucide-settings-2" square size="md"
								@click="isScenariosOpen = true" />
						
						</div>

					</header>

					<UTabs :model-value="activeTab" :items="tabs" size="sm"
						@update:model-value="navigateToTab"
						variant="link" :ui="{ list: 'justify-center' }" />

				</UContainer>
			</div>

			<!-- Page Content -->
			<div class="flex-1 flex flex-col">
				<UContainer class="pt-[84px] flex-1 sm:px-3 lg:px-3 max-w-3xl mx-auto bg-neutral-900/70 px-3">

					<slot />

				</UContainer>
			</div>

		</main>

		<!-- Options Modal -->
		<UModal v-model:open="isOptionsOpen" scrollable>
			<template #content>
				<UCard>
				
					<template #header>
						<div class="flex items-center justify-between">

							<div class="flex items-center gap-3">
								<UIcon name="i-lucide-settings" class="text-primary size-5" />
								<h3 class="text-lg font-bold text-white">{{ $t('options.title') }}</h3>
							</div>

							<UButton color="neutral" variant="ghost" icon="i-lucide-x"
								@click="isOptionsOpen = false" />

						</div>
					</template>

					<div class="flex flex-col space-y-6">

						<!-- Language -->
						<div class="flex flex-col space-y-3">

							<h4 class="text-xs font-semibold text-neutral-400">{{ $t('options.language') }}</h4>

							<div class="grid grid-cols-2 gap-3">

								<UButton v-for="locale in locales" :key="locale.code"
									variant="subtle" :color="localeProperties.code === locale.code ? 'primary' : 'neutral'" class="justify-center"
									@click="setLocale(locale.code)">

									<div class="flex items-center gap-3">
										<img :src="`/flags/${locale.code}.png`" :alt="$t('lang_' + locale.code)"  class="w-6 h-6" />
										<span>{{ $t('lang_' + locale.code) }}</span>
									</div>
									
								</UButton>

							</div>

						</div>

						<!-- Local Data -->
						<div class="flex flex-col space-y-3">

							<h4 class="text-xs font-semibold text-neutral-400">{{ $t('options.local_storage') }}</h4>

							<div class="grid grid-cols-2 gap-3">

								<!-- Wipe Data -->
								<UPopover>

									<UButton block color="error" variant="subtle" icon="i-lucide-trash-2">
										{{ $t('options.wipe') }}
									</UButton>

									<template #content>
										<UCard :ui="{ 'body': 'p-3 sm:p-3' }">
											<div class="flex flex-col items-center gap-4">

												<span class="w-48 text-center text-xs font-semibold text-error">{{ $t('options.wipe_confirm') }}</span>

												<UButton color="error" variant="subtle"
													@click="() => { gameStore.wipeLocalData(); isOptionsOpen = false; }">
													{{ $t('labels.confirm') }}
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
									{{ areDataCopied ? $t('options.export_success') : $t('options.export') }}
								</UButton>

							</div>

						</div>

						<!-- Import Save -->
						<div class="flex flex-col space-y-3">

							<h4 class="text-xs font-semibold text-neutral-400">{{ $t('options.import_title') }}</h4>

							<div class="flex flex-col space-y-3">

								<UTextarea v-model="importInput" :rows="3" autoresize block
									:placeholder="$t('options.import_placeholder')"                                        
									class="text-xs" />

								<UButton block variant="subtle"
									:color="importStatus === 'success' ? 'success' : importStatus === 'error' ? 'error' : 'primary'"                                        
									:icon="importStatus === 'success' ? 'i-lucide-check' : importStatus === 'error' ? 'i-lucide-alert-triangle' : 'i-lucide-download'"
									:disabled="!importInput.trim()"
									@click="importData">
									{{ 
										importStatus === 'success' ? $t('options.import_success') : 
										importStatus === 'error' ? $t('options.import_error') : 
										$t('options.import') 
									}}
								</UButton>
							
							</div>

						</div>

					</div>

				</UCard>
			</template>
		</UModal>

		<!-- Scenarios Modal -->
		<UModal v-model:open="isScenariosOpen" scrollable>
			<template #content>
				<UCard>
				
					<template #header>
						<div class="flex items-center justify-between">

							<div class="flex items-center gap-3">
								<UIcon name="i-lucide-settings-2" class="text-primary size-5" />
								<h3 class="text-lg font-bold text-white">{{ $t('scenarios.title') }}</h3>
							</div>

							<UButton color="neutral" variant="ghost" icon="i-lucide-x"
								@click="isScenariosOpen = false" />

						</div>
					</template>

					<div class="flex flex-col space-y-6">

						<!-- Current scenario -->
						<div class="flex flex-col space-y-3">

							<h4 class="text-xs font-semibold text-neutral-400">{{ $t('scenarios.current') }}</h4>

							<div class="flex items-center justify-between gap-3">

								<div class="flex items-center gap-3">

									<UPopover>

										<UButton color="error" variant="subtle" icon="i-lucide-rotate-ccw" />

										<template #content>
											<UCard :ui="{ 'body': 'p-3 sm:p-3' }">
												<div class="flex flex-col items-center gap-4">

													<span class="w-48 text-center text-xs font-semibold text-error">{{ $t('scenarios.reset_confirm') }}</span>

													<UButton color="error" variant="subtle"
														@click="gameStore.resetLocalData()">
														{{ $t('labels.confirm') }}
													</UButton>

												</div>
											</UCard>
										</template>

									</UPopover>

									<h2 class="text-lg font-bold text-primary">{{ $t('scenario_' + gameStore.currentScenarioId) }}</h2>

								</div>

								<div class="flex items-center gap-3">

									<h2 class="text-lg font-bold font-mono">{{ formatTime(gameStore.totalPlayTime) }}</h2>

									<UButton variant="subtle"
										:color="gameStore.isPaused ? 'success' : 'primary'"                                
										:icon="gameStore.isPaused ? 'i-lucide-play-circle' : 'i-lucide-pause-circle'"
										@click="gameStore.togglePause()" />

								</div>

							</div>

						</div>

						<!-- Available scenarios -->
						<div class="flex flex-col space-y-3">

							<h4 class="text-xs font-semibold text-neutral-400">{{ $t('scenarios.available') }}</h4>
							
							<div class="grid grid-cols-2 gap-3">
								
								<UButton v-for="scenario in gameStore.scenarios" :key="scenario.id"
									variant="subtle" :color="gameStore.currentScenarioId === scenario.id ? 'primary' : 'neutral'" class="justify-center"
									:disabled="gameStore.currentScenarioId === scenario.id"
									@click="gameStore.switchScenario(scenario.id)">
									<span>{{ $t('scenario_' + scenario.id) }}</span>
								</UButton>

							</div>

						</div>

					</div>
				
				</UCard>
			</template>
		</UModal>

		<!-- Victory Modal -->
		<UModal v-model:open="isVictoryOpen" scrollable>
			<template #content>
				<UCard>

					<template #header>
						<div class="flex items-center justify-center gap-3">
							<UIcon name="i-lucide-award" class="text-primary size-5" />
							<h3 class="text-lg font-bold text-white">{{ $t('victory.title') }}</h3>
						</div>
					</template>

					<div class="flex flex-col space-y-4">

						<UAlert variant="subtle" color="success" class="text-center"
							:description="$t('victory.message')" />

						<UCard variant="subtle" :ui="{ 'body': 'sm:p-3 p-3' }">
							<div class="flex justify-between items-center text-xs">
								<span class="text-sm font-bold text-neutral-200">{{ $t('scenario_' + gameStore.currentScenarioId) }}</span>
								<span class="font-bold">{{ formatTime(gameStore.totalPlayTime) }}</span>
							</div>
						</UCard>

						<div class="flex justify-center">
							<UButton color="primary" variant="subtle"
								@click="isVictoryOpen = false">
								{{ $t('victory.close') }}
							</UButton>
						</div>

					</div>

				</UCard>
			</template>
		</UModal>

	</div>
</template>
