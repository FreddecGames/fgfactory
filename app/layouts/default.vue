<script setup lang="ts">

	import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

	import { useGameStore } from '~/stores/game'

	const route = useRoute()
	const gameStore = useGameStore()
	const localePath = useLocalePath()

	const { locale, getLocaleMessage, setLocaleMessage } = useI18n()

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

	const fixedTickSeconds = 0.05

	let lastTimestamp = 0
	let tickAccumulator = 0
	let animationFrameId: number | null = null

	const scheduleNextTick = () => {

		if (animationFrameId !== null || document.hidden || gameStore.isPaused || gameStore.items.length === 0)
			return

		animationFrameId = requestAnimationFrame(runGameLoop)
	}

	const runGameLoop = (timestamp: number) => {

		animationFrameId = null

		if (document.hidden || gameStore.isPaused || gameStore.items.length === 0) {

			lastTimestamp = 0
			tickAccumulator = 0
			
			return
		}

		if (!lastTimestamp) lastTimestamp = timestamp

		let deltaSeconds = (timestamp - lastTimestamp) / 1000
		lastTimestamp = timestamp

		if (deltaSeconds > 1.0) deltaSeconds = 1.0

		tickAccumulator += deltaSeconds

		while (tickAccumulator >= fixedTickSeconds) {

			gameStore.processGameTick(fixedTickSeconds)
			tickAccumulator -= fixedTickSeconds
		}

		scheduleNextTick()
	}

	watch(() => gameStore.isPaused, (isPaused) => {

		if (!isPaused && animationFrameId === null) {

			lastTimestamp = 0
			tickAccumulator = 0
			
			scheduleNextTick()
		}
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

	const handleVisibilityChange = () => {

		if (document.hidden) {

			if (animationFrameId !== null)
				cancelAnimationFrame(animationFrameId)

			lastTimestamp = 0
			tickAccumulator = 0
			animationFrameId = null

			return
		}

		if (hasLoadedGame) {

			gameStore.processOfflineProgress()

			scheduleNextTick()
		}
	}

	onMounted(async () => {

		isLoading.value = true
		loadingError.value = null

		document.addEventListener('visibilitychange', handleVisibilityChange)

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
		document.removeEventListener('visibilitychange', handleVisibilityChange)

		saveOnPageHide()

		gameStore.stopAutoSave()

		cancelAnimationFrame(animationFrameId)

		animationFrameId = null
		lastTimestamp = 0
		tickAccumulator = 0
	})
	
    watch(() => gameStore.hasWon, (newHasWon) => {

        if (hasLoadedGame && newHasWon) {

			gameStore.isItemModalOpen = false
			gameStore.isMachineModalOpen = false
			gameStore.isMissionModalOpen = false

			gameStore.isOptionsModalOpen = false
			gameStore.isScenariosModalOpen = false

			gameStore.isVictoryModalOpen.value = true
		}
    })

</script>

<template>

	<div class="min-h-screen text-neutral-100 flex flex-col">

		<!-- Loading Card -->
		<div v-if="isLoading" class="flex flex-col gap-3 items-center justify-center min-h-screen py-12 px-4 text-center">

			<h1 class="text-xl font-bold text-white flex items-center justify-center gap-2">
				<img src="/favicon.png" :alt="$t('gameName')" class="size-6 object-contain" />
				{{ $t('gameName') }}
			</h1>

			<UCard :ui="{ 'body': 'p-2 sm:p-2 max-w-md' }">
				<div class="flex flex-col space-y-1 items-center">
					<span class="text-primary text-xs">{{ $t('loading.text') }}</span>
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
				<UContainer class="sm:px-3 lg:px-3 backdrop-blur max-w-2xl mx-auto bg-neutral-900/70 px-3 flex flex-col gap-2">

					<header class="pt-2 flex justify-between gap-3">

						<h1 class="text-xl font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-2">
							<img src="/favicon.png" :alt="$t('gameName')" class="size-6 object-contain" />
							{{ gameStore.customGameName || $t('gameName') }}
						</h1>

						<div class="flex items-center gap-3">

							<UTooltip :text="$t('options.title')">
								<UButton color="primary" variant="ghost" icon="i-lucide-settings" square size="md"
									@click="gameStore.isOptionsModalOpen = true" />
							</UTooltip>

							<UTooltip :text="$t('scenarios.title')">
								<UButton color="primary" variant="ghost" icon="i-lucide-settings-2" square size="md"
									@click="gameStore.isScenariosModalOpen = true" />
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
				<UContainer class="pt-[108px] pb-[48px] flex-1 sm:px-3 lg:px-3 max-w-2xl mx-auto bg-neutral-900/70 px-3 flex flex-col space-y-6">

					<slot />

				</UContainer>
			</div>

		</main>

	</div>

	<!-- Options Modal -->
	<ModalOptions v-model:open="gameStore.isOptionsModalOpen" />

	<!-- Scenarios Modal -->
	<ModalScenarios v-model:open="gameStore.isScenariosModalOpen" />

	<!-- Victory Modal -->
	<ModalVictory v-model:open="gameStore.isVictoryModalOpen" />

	<!-- Locked Modal -->
	<ModalLocked v-model:open="gameStore.isLockedModalOpen" />

	<!-- Item Modal -->
	<ModalItem v-model:open="gameStore.isItemModalOpen" />

	<!-- Machine Modal -->
	<UModal v-model:open="gameStore.isMachineModalOpen" scrollable>

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

			<!-- Machine Manual -->
			<ItemManual v-if="gameStore.selectedMachine.manual" :itemId="gameStore.selectedMachine.id" />

		</template>

	</UModal>

	<!-- Mission Modal -->
	<UModal v-model:open="gameStore.isMissionModalOpen" scrollable>

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

			<!-- Mission Description -->
			<div class="rounded-md bg-neutral-800 p-2 text-center">
				<span class="text-xs">{{ $t('desc.' + gameStore.selectedMission.id) }}</span>
			</div>

			<!-- Mission Manuals -->
			<div v-if="gameStore.selectedMission.manual" class="flex flex-col space-y-1">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalMission.manuals') }}</h4>

				<div v-if="gameStore.selectedMission.manual.inputs && gameStore.selectedMission.manual.inputs.length > 0" class="flex flex-col gap-1">
					<div v-for="input in gameStore.selectedMission.manual.inputs" :key="input.id"
						class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 px-2 py-1.5">

							<UButton color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
								:avatar="{ src:gameStore.itemImgs[input.id] }"
								:label="$t(`items.${input.id}`)"
								@click="gameStore.openItem(input.id)" />
							
							<span v-if="gameStore.itemCounts[input.id] >= input.count * gameStore.selectedMission.manualSelectedCount" class="text-success text-xs">{{ gameStore.itemCounts[input.id] }} / {{ input.count.toFixed(0) * gameStore.selectedMission.manualSelectedCount }}</span>
							<span v-else class="text-error text-xs">{{ gameStore.itemCounts[input.id] }} / {{ input.count.toFixed(0) * gameStore.selectedMission.manualSelectedCount }}</span>

					</div>
				</div>
				<div v-else class="flex-1">
					<span class="text-muted text-xs italic">{{ $t('modalItem.noInputs') }}</span>
				</div>

				<div class="mt-3 flex justify-end">

					<UButton v-if="gameStore.selectedMission.count > 0" color="success" variant="subtle" icon="i-lucide-award" disabled size="sm"
						:label="$t('modalMission.completed')" />

					<UButton v-else-if="gameStore.canStartManual(gameStore.selectedMission.manual, gameStore.selectedMission.manualSelectedCount) === 0" color="primary" variant="subtle" icon="i-lucide-award" size="sm"
						:label="$t('modalMission.complete')"
						@click="gameStore.startManual(gameStore.selectedMission.manual, gameStore.selectedMission.manualSelectedCount); gameStore.isMissionModalOpen = false;" />

					<UButton v-else color="neutral" variant="subtle" icon="i-lucide-award" disabled size="sm"
						:label="$t('modalMission.complete')" />

				</div>

			</div>

		</template>

	</UModal>

</template>
