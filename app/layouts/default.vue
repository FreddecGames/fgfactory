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

        if (newHasWon) {

			isOptionsOpen.value = false
			isScenariosOpen.value = false

			isVictoryOpen.value = true
		}
    })

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
		<UModal v-model:open="isVictoryOpen" :dismissible="false" scrollable :ui="{ header: 'p-4 sm:p-4' }">

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

	</div>
</template>
