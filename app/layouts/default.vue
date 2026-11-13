<!-- ./app/layouts/default.vue -->

<script setup lang="ts">

	import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

	import { useGameStore } from '~/stores/game'

	const route = useRoute()
	const gameStore = useGameStore()
	const localePath = useLocalePath()

	const { locales, setLocale, locale, localeProperties, getLocaleMessage, setLocaleMessage } = useI18n()

	type LocaleMessages = Record<string, unknown>

	const baseLocaleMessages = new Map<string, LocaleMessages>()

	let isScenarioLocalizationReady = false
	let scenarioLocaleRequestId = 0

	const mergeLocaleMessages = (base: LocaleMessages, scenario: LocaleMessages): LocaleMessages => {

		const merged = { ...base }

		for (const [key, scenarioValue] of Object.entries(scenario)) {

			const baseValue = merged[key]

			const canMergeNestedObjects =
				baseValue !== null &&
				typeof baseValue === 'object' &&
				!Array.isArray(baseValue) &&
				scenarioValue !== null &&
				typeof scenarioValue === 'object' &&
				!Array.isArray(scenarioValue)

			merged[key] = canMergeNestedObjects
				? mergeLocaleMessages(baseValue as LocaleMessages, scenarioValue as LocaleMessages)
				: scenarioValue
		}

		return merged
	}

	const loadScenarioTranslations = async (scenarioId: string, localeCode: string) => {

		const requestId = ++scenarioLocaleRequestId
		let baseMessages = baseLocaleMessages.get(localeCode)

		if (!baseMessages) {

			baseMessages = getLocaleMessage(localeCode) as LocaleMessages
			baseLocaleMessages.set(localeCode, baseMessages)
		}

		const response = await fetch(`/scenarios/${scenarioId}/locales/${localeCode}.json`)
		if (requestId !== scenarioLocaleRequestId) return

		if (response.status === 404) {

			setLocaleMessage(localeCode, baseMessages)
			return
		}

		if (!response.ok) {
			throw new Error(`Failed to load scenario translations: ${response.status} ${response.statusText}`)
		}

		const scenarioMessages: unknown = await response.json()
		if (!scenarioMessages || typeof scenarioMessages !== 'object' || Array.isArray(scenarioMessages))
			throw new Error(`Invalid scenario translation file for locale "${localeCode}"`)

		if (requestId !== scenarioLocaleRequestId) return

		setLocaleMessage(localeCode, mergeLocaleMessages(baseMessages, scenarioMessages as LocaleMessages))
	}

	let animationFrameId: number | null = null
	let lastTimestamp = 0

	const scheduleNextTick = () => {

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

	watch(() => gameStore.isPaused, (isPaused) => {

		if (!isPaused && animationFrameId === null) scheduleNextTick()
	})

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
		
	let hasLoadedGame = false

	const saveOnPageHide = () => {
		if (hasLoadedGame && !gameStore.isRefreshing) gameStore.saveLocalData()
	}

	onMounted(async () => {

		isLoading.value = true
		loadingError.value = null

		try {

			await gameStore.loadLocalData()

			await loadScenarioTranslations(gameStore.currentScenarioId, locale.value)
			isScenarioLocalizationReady = true

			hasLoadedGame = true

			window.addEventListener('pagehide', saveOnPageHide)
		
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

	watch([() => gameStore.currentScenarioId, locale], async ([scenarioId, localeCode]) => {

		if (!isScenarioLocalizationReady) return

		try {

			await loadScenarioTranslations(scenarioId, localeCode)
		}
		catch (err: any) {

			loadingError.value = err.message
			console.error(err)
		}
	})

	onBeforeUnmount(() => {

		window.removeEventListener('pagehide', saveOnPageHide)

		saveOnPageHide()

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

        if (hasLoadedGame && newHasWon) {

			gameStore.isItemModalOpen = false
			gameStore.isMachineModalOpen = false
			gameStore.isMissionModalOpen = false

			isOptionsOpen.value = false
			isScenariosOpen.value = false

			isVictoryOpen.value = true
		}
    })

	function getManualProgress(manual: any): number {

		const totalDuration = manual.seconds * manual.processCount
		if (!manual.isProcessing || totalDuration <= 0) return 0

		return Math.min(100, Math.max(0, ((totalDuration - manual.remainingSeconds) / totalDuration) * 100))
	}

</script>

<template>

	<div class="min-h-screen text-neutral-100 flex flex-col">

		<!-- Loading Card -->
		<div v-if="isLoading" class="flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center">
			<UCard :ui="{ 'body': 'p-3 sm:p-3 max-w-md' }">
				<div class="flex flex-col space-y-4 items-center">

					<h1 class="text-xl font-bold text-white flex items-center justify-center gap-2">
						<img src="/favicon.png" :alt="$t('gameName')" class="size-6 object-contain" />
						{{ $t('gameName') }}
					</h1>

					<div class="flex flex-col space-y-1 items-center">
						<span class="text-primary text-xs">{{ $t('loading.text') }}</span>
						<UProgress size="xs" animation="carousel" class="w-64" />
					</div>

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
							<img src="/favicon.png" :alt="$t('gameName')" class="size-6 object-contain" />
							{{ gameStore.customGameName || $t('gameName') }}
						</h1>

						<div class="flex items-center gap-3">

							<UTooltip :text="$t('options.title')">
								<UButton color="primary" variant="ghost" icon="i-lucide-settings" square size="md"
									@click="isOptionsOpen = true" />
							</UTooltip>

							<UTooltip :text="$t('scenarios.title')">
								<UButton color="primary" variant="ghost" icon="i-lucide-settings-2" square size="md"
									@click="isScenariosOpen = true" />
							</UTooltip>

						</div>

					</header>

					<UTabs :model-value="activeTab" :items="tabs" size="sm"
						@update:model-value="navigateToTab"
						variant="link" :ui="{ list: 'justify-center' }" />

				</UContainer>
			</div>

			<!-- Page Content -->
			<div class="flex-1 flex flex-col">
				<UContainer class="pt-[108px] pb-[48px] flex-1 sm:px-3 lg:px-3 max-w-3xl mx-auto bg-neutral-900/70 px-3 flex flex-col space-y-6">

					<slot />

				</UContainer>
			</div>

		</main>

	</div>

	<!-- Options Modal -->
	<UModal v-model:open="isOptionsOpen" scrollable :ui="{ header: 'p-4 sm:p-4' }">
		
		<!-- Modal Header -->
		<template #header>

			<div class="flex items-center gap-3">
				<UIcon name="i-lucide-settings" class="text-primary size-5" />
				<h3 class="text-lg font-bold text-white">{{ $t('options.title') }}</h3>
			</div>

			<UButton color="neutral" variant="ghost" icon="i-lucide-x"
				@click="isOptionsOpen = false" />

		</template>

		<!-- Modal Body -->
		<template #body>

			<!-- Language -->
			<div class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('options.language') }}</h4>

				<div class="grid grid-cols-2 gap-2">

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

			<!-- Options -->
			<div class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('options.options') }}</h4>

				<div class="flex flex-col space-y-2">

					<UInput v-model="gameStore.customGameName" block
						:placeholder="$t('options.game_name_placeholder')"
						class="w-full" />

				</div>

			</div>

			<!-- Local Data -->
			<div class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('options.local_storage') }}</h4>

				<div class="grid grid-cols-2 gap-2">

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
			<div class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('options.import_title') }}</h4>

				<div class="flex flex-col space-y-2">

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

		</template>

	</UModal>

	<!-- Scenarios Modal -->
	<UModal v-model:open="isScenariosOpen" scrollable :ui="{ header: 'p-4 sm:p-4' }">
		
		<!-- Modal Header -->
		<template #header>

			<div class="flex items-center gap-3">
				<UIcon name="i-lucide-settings-2" class="text-primary size-5" />
				<h3 class="text-lg font-bold text-white">{{ $t('scenarios.title') }}</h3>
			</div>

			<UButton color="neutral" variant="ghost" icon="i-lucide-x"
				@click="isScenariosOpen = false" />

		</template>

		<!-- Modal Body -->
		<template #body>

			<!-- Current scenario -->
			<div class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('scenarios.current') }}</h4>

				<div class="flex items-center justify-between gap-2">

					<div class="flex items-center gap-2">

						<UPopover>

							<UButton color="error" variant="subtle" icon="i-lucide-rotate-ccw" size="sm" />

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

					<div class="flex items-center gap-2">

						<h2 class="text-lg font-bold font-mono">{{ formatTime(gameStore.totalPlayTime) }}</h2>

						<UButton variant="subtle" size="sm"
							:color="gameStore.isPaused ? 'success' : 'primary'"                                
							:icon="gameStore.isPaused ? 'i-lucide-play-circle' : 'i-lucide-pause-circle'"
							@click="gameStore.togglePause()" />

					</div>

				</div>

				<UAlert v-if="gameStore.hasWon" variant="subtle" color="success" class="text-center" icon="i-lucide-award"
					:description="$t('victory.message')" />

			</div>

			<!-- Available scenarios -->
			<div class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('scenarios.available') }}</h4>
				
				<div class="grid grid-cols-2 gap-2">
					
					<UButton v-for="scenario in gameStore.scenarios" :key="scenario.id"
						variant="subtle" :color="gameStore.currentScenarioId === scenario.id ? 'primary' : 'neutral'" class="justify-center"
						:disabled="gameStore.currentScenarioId === scenario.id"
						@click="gameStore.switchScenario(scenario.id)">
						<span>{{ $t('scenario_' + scenario.id) }}</span>
					</UButton>

				</div>

			</div>

			<!-- Victories -->
			<div class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('scenarios.victories') }}</h4>

				<div v-if="gameStore.victories && gameStore.victories.length > 0" class="flex flex-col space-y-2">
					<div v-for="(victory, index) in gameStore.victories" :key="index"
						class="rounded-md bg-neutral-800 p-2 flex justify-between items-center text-xs">

						<div class="flex flex-col gap-1">
							<span>{{ $t('scenario_' + victory.scenarioId) }}</span>
							<span class="text-muted text-xs">{{ victory.date }}</span>
						</div>

						<div class="flex items-center gap-2">
							<span>{{ formatTime(victory.totalPlayTime) }}</span>
							<UButton color="error" variant="subtle" icon="i-lucide-trash" size="sm"
								@click="gameStore.victoryDelete(index)" />
						</div>

					</div>
				</div>
				<span v-else class="text-xs italic text-muted">{{ $t('scenarios.no_victory') }}</span>

			</div>

		</template>
	
	</UModal>

	<!-- Victory Modal -->
	<UModal v-model:open="isVictoryOpen" scrollable :ui="{ header: 'p-4 sm:p-4' }" :dismissible="false">

		<!-- Modal Header -->
		<template #header>
			<div class="flex items-center justify-center gap-3">
				<UIcon name="i-lucide-award" class="text-primary size-5" />
				<h3 class="text-lg font-bold text-white">{{ $t('victory.title') }}</h3>
			</div>
		</template>

		<!-- Modal Body -->
		<template #body>

			<div class="flex flex-col space-y-2">

				<UAlert variant="subtle" color="success" class="text-center" icon="i-lucide-award"
					:description="$t('victory.message')" />

				<div class="rounded-md bg-neutral-800 p-2 flex justify-between items-center text-xs">
					<span>{{ $t('scenario_' + gameStore.currentScenarioId) }}</span>
					<span>{{ formatTime(gameStore.totalPlayTime) }}</span>
				</div>

			</div>

			<div class="flex justify-center">
				<UButton color="primary" variant="subtle"
					@click="isVictoryOpen = false">
					{{ $t('victory.close') }}
				</UButton>
			</div>

		</template>

	</UModal>

	<!-- Item Modal -->
	<UModal v-model:open="gameStore.isItemModalOpen" scrollable :ui="{ header: 'p-4 sm:p-4' }">

		<!-- Modal Header -->
		<template #header>

			<div class="flex items-center gap-2">
				<img :src="gameStore.itemImgs[gameStore.selectedItem.id]" :alt="$t(`items.${gameStore.selectedItem.id}`)" class="size-7 object-contain" />
				<h3 class="text-lg font-bold text-white">{{ $t(`items.${gameStore.selectedItem.id}`) }}</h3>
			</div>

			<UButton color="neutral" variant="ghost" icon="i-lucide-x"
				@click="gameStore.isItemModalOpen = false" />

		</template>

		<!-- Modal Body -->
		<template #body>

			<div class="grid grid-cols-2 gap-1">

				<!-- Item Count -->
				<div class="flex flex-col space-y-2">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.count') }}</h4>

					<div class="rounded-md bg-neutral-800 ps-2 pe-1 py-1">

						<span v-if="gameStore.selectedItem.count >= gameStore.selectedItem.max" class="text-error">{{ gameStore.selectedItem.count.toFixed(0) }}</span>
						<span v-else-if="gameStore.selectedItem.count > 0" class="text-white">{{ gameStore.selectedItem.count.toFixed(0) }}</span>
						<span v-else-if="gameStore.selectedItem.count < 0" class="text-error">{{ gameStore.selectedItem.count.toFixed(0) }}</span>
						<span v-else class="text-muted">{{ gameStore.selectedItem.count.toFixed(0) }}</span>

						<span class="text-muted"> / {{ gameStore.selectedItem.max }}</span>

					</div>

				</div>

				<!-- Item Production Rate -->
				<div class="flex flex-col space-y-2">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.production') }}</h4>

					<div class="rounded-md bg-neutral-800 ps-2 pe-1 py-1">
						<span v-if="gameStore.itemProductionRates[gameStore.selectedItem.id] > 0" class="text-success">+{{ gameStore.itemProductionRates[gameStore.selectedItem.id].toFixed(1) }} /s</span>
						<span v-else-if="gameStore.itemProductionRates[gameStore.selectedItem.id] < 0" class="text-error">{{ gameStore.itemProductionRates[gameStore.selectedItem.id].toFixed(1) }} /s</span>
						<span v-else class="text-muted">{{ gameStore.itemProductionRates[gameStore.selectedItem.id].toFixed(1) }} /s</span>						
					</div>

				</div>

			</div>

			<!-- Item Storages -->
			<div v-if="gameStore.selectedItem.storages.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.storages') }}</h4>

				<div class="flex flex-col gap-1">
					<div v-for="storage in gameStore.selectedItem.storages" :key="storage.id"
						class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 ps-2 pe-1 py-1">

						<div class="flex min-w-0 items-center gap-2">

							<UButton color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
								:avatar="{ src:gameStore.itemImgs[storage.storerId] }"
								:label="$t(`items.${storage.storerId}`)"
								@click="gameStore.openMachine(storage.storerId)" />

							<UBadge v-if="gameStore.itemAvailableCounts[storage.storerId] > 0" variant="subtle" color="success" size="sm">{{ gameStore.itemAvailableCounts[storage.storerId] }}</UBadge>

						</div>								

						<div class="flex shrink-0 items-center gap-6">

							<span v-if="storage.assignedCount > 0" class="text-xs font-semibold text-success">+{{ storage.capacity * storage.assignedCount }}</span>

							<div class="flex items-center gap-2">

								<UButton :color="storage.assignedCount > 0 ? 'error' : 'neutral'" variant="subtle" icon="i-lucide-minus" size="xs"
									:disabled="storage.assignedCount <= 0"
									@click="gameStore.unassignStorageStorer(storage, 1)" />

								<span v-if="storage.assignedCount > 0" class="min-w-10 text-center text-xs">{{ storage.assignedCount }}</span>
								<span v-else class="min-w-10 text-center text-xs text-muted">{{ storage.assignedCount }}</span>

								<UButton :color="gameStore.itemAvailableCounts[storage.storerId] > 0 ? 'primary' : 'neutral'" variant="subtle" icon="i-lucide-plus" size="xs"
									:disabled="gameStore.itemAvailableCounts[storage.storerId] <= 0"
									@click="gameStore.assignStorageStorer(storage, 1)" />

							</div>
								
						</div>

					</div>
				</div>

			</div>

			<div v-if="gameStore.selectedItem.inLinks.length > 0 || gameStore.selectedItem.prods.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.prods') }}</h4>

				<!-- Item In-Links -->
				<div v-if="gameStore.selectedItem.inLinks.length > 0" class="flex items-center gap-2">
					<UTooltip v-for="link in gameStore.selectedItem.inLinks" :key="link.id" :text="$t('items.' + link.sourceId)">
						<UButton color="neutral" variant="soft" class="relative aspect-square"
							@click="gameStore.openItem(link.sourceId)">

							<img :src="gameStore.itemImgs[link.sourceId]" :alt="$t('items.' + link.sourceId)" class="size-5 object-contain" />

							<UBadge size="xs" color="neutral" variant="subtle"
								class="absolute -top-0.5 -right-0.5 z-10">
								<span v-if="link.count > 0">{{ link.count.toFixed(0) }}</span>
								<span v-else-if="link.count === 0" class="text-muted">{{ link.count.toFixed(0) }}</span>
							</UBadge>

						</UButton>
					</UTooltip>
				</div>

				<!-- Item Prods -->
				<div v-if="gameStore.selectedItem.prods.length > 0" class="flex flex-col gap-1">
					<div v-for="prod in gameStore.selectedItem.prods" :key="prod.id"
						class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 p-2">

						<div class="flex min-w-0 items-center gap-2">

							<UButton color="neutral" variant="soft" size="xs"
								:avatar="{ src:gameStore.itemImgs[prod.machineId] }"
								@click="gameStore.openMachine(prod.machineId)">
								<span class="truncate text-muted">{{ $t(`items.${prod.machineId}`) }}</span>
							</UButton>

							<UBadge v-if="gameStore.itemAvailableCounts[prod.machineId] > 0" variant="subtle" color="success" size="sm">{{ gameStore.itemAvailableCounts[prod.machineId] }}</UBadge>

						</div>

						<div class="flex shrink-0 items-center gap-6">

							<UIcon v-if="gameStore.prodWarnings[prod.id]" name="i-lucide-triangle-exclamation-point" class="text-error" />
							<span v-if="prod.assignedCount > 0" class="text-xs font-semibold text-success">+{{ prod.assignedCount * prod.outputCount / prod.seconds }}/s</span>

							<div class="flex items-center gap-2">

								<UButton :color="prod.assignedCount > 0 ? 'error' : 'neutral'" variant="subtle" icon="i-lucide-minus" size="xs"
									:disabled="prod.assignedCount <= 0"
									@click="gameStore.unassignProdMachine(prod, 1)" />

								<span v-if="prod.assignedCount > 0" class="min-w-10 text-center text-xs">{{ prod.assignedCount }}</span>
								<span v-else class="min-w-10 text-center text-xs text-muted">{{ prod.assignedCount }}</span>

								<UButton :color="gameStore.itemAvailableCounts[prod.machineId] > 0 ? 'primary' : 'neutral'" variant="subtle" icon="i-lucide-plus" size="xs"
									:disabled="gameStore.itemAvailableCounts[prod.machineId] <= 0"
									@click="gameStore.assignProdMachine(prod, 1)" />

							</div>

						</div>

					</div>
				</div>

			</div>

			<!-- Item Out-Links -->
			<div v-if="gameStore.selectedItem.outLinks.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.links') }}</h4>

				<div class="flex flex-col gap-1">
					<div v-for="link in gameStore.selectedItem.outLinks" :key="link.id"
						class="flex items-center justify-between gap-4 rounded-md bg-neutral-800 p-2">

						<div class="flex min-w-0 items-center gap-2">

							<UButton color="neutral" variant="soft" size="xs"
								:avatar="{ src:gameStore.itemImgs[link.conveyorId] }"
								@click="gameStore.openMachine(link.conveyorId)">
								<span class="truncate text-muted">{{ $t(`items.${link.conveyorId}`) }}</span>
							</UButton>

							<UBadge v-if="gameStore.itemAvailableCounts[link.conveyorId] > 0" variant="subtle" color="success" size="sm">{{ gameStore.itemAvailableCounts[link.conveyorId] }}</UBadge>

						</div>

						<div class="flex shrink-0 items-center gap-6">

							<UIcon v-if="gameStore.linkWarnings[link.id]" name="i-lucide-triangle-exclamation-point" class="text-error" />

							<div class="flex items-center gap-2">

								<span v-if="link.assignedCount > 0" class="text-xs font-semibold text-error">-{{ link.assignedCount * link.conveyorSpeed }} /s</span>

								<UIcon name="i-lucide-move-right" size="xs" class="text-muted" />

								<UTooltip :text="$t(`items.${link.targetId}`)">
									<UButton color="neutral" variant="soft" size="xs"
										:avatar="{ src:gameStore.itemImgs[link.targetId] }"
										@click="gameStore.openItem(link.targetId)" />
								</UTooltip>

							</div>

							<div class="flex items-center gap-2">

								<UButton :color="link.assignedCount > 0 ? 'error' : 'neutral'" variant="subtle" icon="i-lucide-minus" size="xs"
									:disabled="link.assignedCount <= 0"
									@click="gameStore.unassignLinkConveyor(link, 1)" />

								<span v-if="link.assignedCount > 0" class="min-w-10 text-center text-xs">{{ link.assignedCount }}</span>
								<span v-else class="min-w-10 text-center text-xs text-muted">{{ link.assignedCount }}</span>

								<UButton :color="gameStore.itemAvailableCounts[link.conveyorId] > 0 ? 'primary' : 'neutral'" variant="subtle" icon="i-lucide-plus" size="xs"
									:disabled="gameStore.itemAvailableCounts[link.conveyorId] <= 0"
									@click="gameStore.assignLinkConveyor(link, 1)" />

							</div>

						</div>

					</div>
				</div>

			</div>

			<!-- Item Manuals -->
			<div v-if="gameStore.selectedItem.manuals.length > 0" class="flex flex-col space-y-2">

				<div class="flex items-center justify-between gap-2">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.manuals') }}</h4>

					<div class="flex items-center gap-1">
						<UButton v-for="count in gameStore.selectedItem.manualCounts" size="xs"
							:variant="gameStore.selectedItem.manualSelectedCount == count ? 'subtle' : 'soft'"
							:color="gameStore.selectedItem.manualSelectedCount == count ? 'primary' : 'neutral'"
							@click="gameStore.selectedItem.manualSelectedCount = count">
							<span class="text-[10px]">+{{ count }}</span>
						</UButton>
					</div>

				</div>

				<div class="flex flex-col gap-1">
					<div v-for="manual in gameStore.selectedItem.manuals" :key="manual.id" class="flex items-center gap-2">

						<div v-if="manual.inputs && manual.inputs.length > 0" class="flex-1 flex items-center gap-2">
							<UTooltip v-for="input in manual.inputs" :key="input.id" :text="$t('items.' + input.id)">
								<UButton color="neutral" variant="soft" class="relative aspect-square"
									@click="gameStore.openItem(input.id)">

									<img :src="gameStore.itemImgs[input.id]" :alt="$t('items.' + input.id)" class="size-5 object-contain" />

									<UBadge size="xs" color="neutral" variant="subtle"
										class="absolute -top-0.5 -right-0.5 z-10">
										<span v-if="gameStore.itemCounts[input.id] >= input.count * gameStore.selectedItem.manualSelectedCount" class="text-success">{{ input.count.toFixed(0) * gameStore.selectedItem.manualSelectedCount }}</span>
										<span v-else class="text-error">{{ input.count.toFixed(0) * gameStore.selectedItem.manualSelectedCount }}</span>
									</UBadge>

								</UButton>								
							</UTooltip>
						</div>
						<div v-else class="flex-1">
							<span class="text-muted text-xs italic">{{ $t('modalItem.noManualInputs') }}</span>
						</div>

						<div class="rounded-md bg-neutral-800 p-2 flex items-center gap-2">

							<div class="w-24 flex flex-col items-end gap-1">

								<div class="w-full flex justify-between gap-2">
									<span class="text-success text-xs">+{{ manual.outputCount * gameStore.selectedItem.manualSelectedCount }}</span>
									<span v-if="manual.isProcessing" class="text-end text-xs text-primary">{{ formatTime(manual.remainingSeconds) }}</span>
									<span v-else class="text-end text-xs text-muted">{{ formatTime(manual.seconds * gameStore.selectedItem.manualSelectedCount) }}</span>
								</div>

								<UProgress :model-value="getManualProgress(manual)" size="sm" color="primary" class="flex-1" />

							</div>
							
							<UButton v-if="manual.isProcessing" color="error" variant="subtle" icon="i-lucide-square" size="sm"
								@click="gameStore.cancelManual(manual)" />
							
							<UButton v-else-if="gameStore.canStartManual(manual, gameStore.selectedItem.manualSelectedCount)" color="primary" variant="subtle" icon="i-lucide-play" size="sm"
								@click="gameStore.startManual(manual, gameStore.selectedItem.manualSelectedCount)" />

							<UButton v-else color="neutral" variant="subtle" icon="i-lucide-play" disabled  size="sm" />

						</div>

					</div>
				</div>

			</div>

		</template>

	</UModal>

	<!-- Machine Modal -->
	<UModal v-model:open="gameStore.isMachineModalOpen" scrollable :ui="{ header: 'p-4 sm:p-4' }">

		<!-- Modal Header -->
		<template #header>

			<div class="flex items-center gap-2">
				<img :src="gameStore.itemImgs[gameStore.selectedMachine.id]" :alt="$t('items.' + gameStore.selectedMachine.id)" class="size-7 object-contain" />
				<h3 class="text-lg font-bold text-white">{{ $t('items.' + gameStore.selectedMachine.id) }}</h3>
			</div>

			<UButton color="neutral" variant="ghost" icon="i-lucide-x"
				@click="gameStore.isMachineModalOpen = false" />

		</template>

		<!-- Modal Body -->
		<template #body>

			<div class="grid grid-cols-2 gap-1">

				<!-- Machine Count -->
				<div class="flex flex-col space-y-2">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalMachine.count') }}</h4>

					<div class="rounded-md bg-neutral-800 p-2">
						<span v-if="gameStore.selectedMachine.count > 0" class="text-white">{{ gameStore.selectedMachine.count.toFixed(0) }}</span>
						<span v-else-if="gameStore.selectedMachine.count < 0" class="text-error">{{ gameStore.selectedMachine.count.toFixed(0) }}</span>
						<span v-else class="text-muted">{{ gameStore.selectedMachine.count.toFixed(0) }}</span>
					</div>

				</div>

				<!-- Machine Available Count -->
				<div class="flex flex-col space-y-2">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalMachine.available') }}</h4>

					<div class="rounded-md bg-neutral-800 p-2">
						<span v-if="gameStore.itemAvailableCounts[gameStore.selectedMachine.id] > 0" class="text-success">{{ gameStore.itemAvailableCounts[gameStore.selectedMachine.id].toFixed(0) }}</span>
						<span v-else class="text-muted">{{ gameStore.itemAvailableCounts[gameStore.selectedMachine.id].toFixed(0) }}</span>
					</div>

				</div>

			</div>

			<!-- Machine Manuals -->
			<div v-if="gameStore.selectedMachine.manuals.length > 0" class="flex flex-col space-y-2">

				<div class="flex items-center justify-between gap-2">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.manuals') }}</h4>

					<div class="flex items-center gap-1">
						<UButton v-for="count in gameStore.selectedMachine.manualCounts" size="xs"
							:variant="gameStore.selectedMachine.manualSelectedCount == count ? 'subtle' : 'soft'"
							:color="gameStore.selectedMachine.manualSelectedCount == count ? 'primary' : 'neutral'"
							@click="gameStore.selectedMachine.manualSelectedCount = count">
							<span class="text-[10px]">+{{ count }}</span>
						</UButton>
					</div>

				</div>

				<div class="flex flex-col gap-1">
					<div v-for="manual in gameStore.selectedMachine.manuals" :key="manual.id" class="flex items-center gap-2">

						<div v-if="manual.inputs && manual.inputs.length > 0" class="flex-1 flex items-center gap-2">
							<UTooltip v-for="input in manual.inputs" :key="input.id" :text="$t('items.' + input.id)">
								<UButton color="neutral" variant="soft" class="relative aspect-square"
									@click="gameStore.openItem(input.id)">

									<img :src="gameStore.itemImgs[input.id]" :alt="$t('items.' + input.id)" class="size-5 object-contain" />

									<UBadge size="xs" color="neutral" variant="subtle"
										class="absolute -top-0.5 -right-0.5 z-10">
										<span v-if="gameStore.itemCounts[input.id] >= input.count * gameStore.selectedMachine.manualSelectedCount" class="text-success">{{ input.count.toFixed(0) * gameStore.selectedItem.manualSelectedCount }}</span>
										<span v-else class="text-error">{{ input.count.toFixed(0) * gameStore.selectedMachine.manualSelectedCount }}</span>
									</UBadge>

								</UButton>								
							</UTooltip>
						</div>
						<div v-else class="flex-1">
							<span class="text-muted text-xs italic">{{ $t('modalItem.noManualInputs') }}</span>
						</div>

						<div class="rounded-md bg-neutral-800 p-2 flex items-center gap-2">

							<div class="w-24 flex flex-col items-end gap-1">

								<div class="w-full flex justify-between gap-2">
									<span class="text-success text-xs">+{{ manual.outputCount * gameStore.selectedMachine.manualSelectedCount }}</span>
									<span v-if="manual.isProcessing" class="text-end text-xs text-primary">{{ formatTime(manual.remainingSeconds) }}</span>
									<span v-else class="text-end text-xs text-muted">{{ formatTime(manual.seconds * gameStore.selectedMachine.manualSelectedCount) }}</span>
								</div>

								<UProgress :model-value="getManualProgress(manual)" size="sm" color="primary" class="flex-1" />

							</div>
							
							<UButton v-if="manual.isProcessing" color="error" variant="subtle" icon="i-lucide-square" size="sm"
								@click="gameStore.cancelManual(manual)" />
							
							<UButton v-else-if="gameStore.canStartManual(manual, gameStore.selectedMachine.manualSelectedCount)" color="primary" variant="subtle" icon="i-lucide-play" size="sm"
								@click="gameStore.startManual(manual, gameStore.selectedMachine.manualSelectedCount)" />

							<UButton v-else color="neutral" variant="subtle" icon="i-lucide-play" disabled  size="sm" />

						</div>

					</div>
				</div>

			</div>

		</template>

	</UModal>

	<!-- Mission Modal -->
	<UModal v-model:open="gameStore.isMissionModalOpen" scrollable :ui="{ header: 'p-4 sm:p-4' }">

		<!-- Modal Header -->
		<template #header>

			<div class="flex items-center gap-2">
				<img :src="gameStore.itemImgs[gameStore.selectedMission.id]" :alt="$t('items.' + gameStore.selectedMission.id)" class="size-7 object-contain" />
				<h3 class="text-lg font-bold text-white">{{ $t('items.' + gameStore.selectedMission.id) }}</h3>
			</div>

			<UButton color="neutral" variant="ghost" icon="i-lucide-x"
				@click="gameStore.isMissionModalOpen = false" />

		</template>

		<!-- Modal Body -->
		<template #body>

			<!-- Mission Manuals -->
			<div v-if="gameStore.selectedMission.manuals.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalMission.manuals') }}</h4>

				<div class="flex flex-col gap-1">
					<div v-for="manual in gameStore.selectedMission.manuals" :key="manual.id" class="flex items-center gap-2">

						<div v-if="manual.inputs && manual.inputs.length > 0" class="flex-1 flex items-center gap-2">
							<UTooltip v-for="input in manual.inputs" :key="input.id" :text="$t('items.' + input.id)">
								<UButton color="neutral" variant="soft" class="relative aspect-square"
									@click="gameStore.openItem(input.id)">

									<img :src="gameStore.itemImgs[input.id]" :alt="$t('items.' + input.id)" class="size-5 object-contain" />

									<UBadge size="xs" color="neutral" variant="subtle"
										class="absolute -top-0.5 -right-0.5 z-10">
										<span v-if="gameStore.itemCounts[input.id] >= input.count * gameStore.selectedMission.manualSelectedCount" class="text-success">{{ input.count.toFixed(0) * gameStore.selectedItem.manualSelectedCount }}</span>
										<span v-else class="text-error">{{ input.count.toFixed(0) * gameStore.selectedMission.manualSelectedCount }}</span>
									</UBadge>

								</UButton>								
							</UTooltip>
						</div>
						<div v-else class="flex-1">
							<span class="text-muted text-xs italic">{{ $t('modalItem.noManualInputs') }}</span>
						</div>

						<div v-if="gameStore.selectedMission.count >= gameStore.selectedMission.max">
							<UButton color="success" variant="subtle" icon="i-lucide-check" disabled  size="sm">
								{{ $t('modalMission.completed') }}
							</UButton>
						</div>
						<div v-else-if="manual.seconds > 0" class="flex items-center gap-2">

							<div class="w-24 flex flex-col items-end gap-1">
								<span v-if="manual.isProcessing" class="text-end text-xs text-primary">{{ formatTime(manual.remainingSeconds) }}</span>
								<span v-else class="text-end text-xs text-muted">{{ formatTime(manual.seconds) }}</span>
								<UProgress :model-value="getManualProgress(manual)" size="sm" color="primary" class="flex-1" />
							</div>
							
							<UButton v-if="manual.isProcessing" color="error" variant="subtle" icon="i-lucide-square" size="sm"
								@click="gameStore.cancelManual(manual)" />
							
							<UButton v-else-if="gameStore.canStartManual(manual, 1)" color="primary" variant="subtle" icon="i-lucide-play" size="sm"
								@click="gameStore.startManual(manual, 1)" />

							<UButton v-else color="neutral" variant="subtle" icon="i-lucide-play" disabled  size="sm" />

						</div>
						<div v-else class="flex items-center gap-2">

							<UButton v-if="gameStore.canStartManual(manual, 1)" color="primary" variant="subtle" icon="i-lucide-check" size="sm"
								@click="gameStore.startManual(manual, 1)">
								{{ $t('modalMission.complete') }}
							</UButton>

							<UButton v-else color="neutral" variant="subtle" icon="i-lucide-check" disabled  size="sm">
								{{ $t('modalMission.complete') }}
							</UButton>

						</div>

					</div>
				</div>

			</div>

		</template>

	</UModal>

</template>
