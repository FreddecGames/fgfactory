<script setup>

	import * as locales from '@nuxt/ui/locale'

	const { locale, t } = useI18n()

	const lang = computed(() => locales[locale.value].code)
	const dir = computed(() => locales[locale.value].dir)

	useHead({
	
		htmlAttrs: { lang, dir },

        titleTemplate: (titleChunk) => {
		
            return titleChunk ? t(titleChunk) + ' - ' + t('game_title') : t('game_title')
        },
		
		meta: [
		
			{ name:'theme-color', content:'#1b1718' },
		],
	})
	
	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	var autoSaveInterval = null
	
	const save = () => {
	
		if (!store.resetInProgress) {
		
			store.lastSavedTime = Date.now()
			
			let state = {}			
			store.save(state)
			console.log(state)
			
			let text = JSON.stringify(state)
			let compressed = LZString.compressToBase64(text)
			localStorage.setItem(store.localStorageName, compressed)
		}
	}
	
	const handleBeforeUnload = () => {
	
		if (!store.resetInProgress) save()
		
		if (autoSaveInterval) clearInterval(autoSaveInterval)
		
		window.removeEventListener('beforeunload', handleBeforeUnload)		
	}
	
	import ModalOffline from '~/components/ModalOffline.vue'
	import ModalVictory from '~/components/ModalVictory.vue'

	const overlay = useOverlay()
	
	const mainLoop = () => {
	
		requestAnimationFrame(mainLoop)
		
		store.doTick()

		if (store.isVictoryReached) {
		
			store.victory = true
			
			let modalVictory = overlay.create(ModalVictory)
			modalVictory.open()
		}
	}
	
	import LZString from 'lz-string'
	
	const status = ref('loading')

	setTimeout(async () => {
		try {
			
			let loadedData = localStorage.getItem(store.localStorageName)
			if (loadedData && loadedData !== null) {
				
				let text = LZString.decompressFromBase64(loadedData)
				loadedData = JSON.parse(text)					
				console.log(loadedData)
				
				store.init(loadedData.currentScenarioId)
				store.load(loadedData)

				let currentTimeMs = Date.now()				
				let delay = (store.lastSavedTime - currentTimeMs) / 1000		
				
				if (delay > 60 * 15) {
				
					store.computeOfflineProgress(delay)
					
					let modalOffline = overlay.create(ModalOffline, { props:{ seconds:delay } })
					modalOffline.open()
				}
			}
			else {

				store.init('scenario_1')
			}
			
			store.refreshAll()
			
			store.lastFrameTimeMs = Date.now()

			autoSaveInterval = setInterval(() => { save() }, 30000)
			
			window.addEventListener('beforeunload', handleBeforeUnload)
			
			status.value = 'loaded'
			
			const route = useRoute()
			
			if (route.path == '/') await navigateTo('/missions')
			
			mainLoop()
		}
		catch(error) {
			
			status.value = 'error'
			
			console.error(error)
		}
	}, 500)
	
</script>

<template>

	<UApp :locale="locales[locale]">
	
		<div v-if="status == 'loading'" class="w-full h-full flex items-center justify-center">
			<UCard variant="outline">
				<div class="flex flex-col items-center gap-3">
					
					<div class="flex items-center gap-2">					
						<img src="/favicon.png" width="24" height="24" class="rounded" />
						<span class="text-xl font-bold">{{ $t('game_title') }}</span>						
					</div>
					
					<span class="animate-pulse text-xs text-(--ui-primary)">{{ $t('loading_text') }}</span>
					
				</div>
			</UCard>
		</div>

		<div v-else-if="status == 'error'" class="w-full h-full flex items-center justify-center">		

			<div class="w-11/12 max-w-lg">
				<UCard variant="outline">
					<div class="grid gap-6">
						
						<div class="flex items-center justify-center gap-2">							
							<img src="/favicon.png" width="24" height="24" class="rounded" />
							<span class="text-xl font-bold">{{ $t('game_title') }}</span>
						</div>
						
						<UAlert class="justify-center text-center" :title="$t('error_text')" color="error" variant="subtle" icon="i-lucide-badge-alert" />
						
						<div class="grid gap-3">
						
							<span class="text-center text-sm text-gray-400">{{ $t('error_text_2') }}</span>
							
							<div class="w-full flex items-center justify-center gap-3">						
								<UButton class="w-5/12 lg:w-3/12 justify-center" to="https://discord.gg/ZXrggavUpv" target="_blank" label="Discord" color="neutral" variant="subtle" :avatar="{ src:'/discord.png' }" />
							</div>
							
							<UTextarea class="w-full" size="xs" :rows="3" :placeholder="store.localStorageData" disabled readonly />
							
							<div class="w-full flex items-center justify-center gap-3">						
								<btn-export class="w-5/12 lg:w-3/12" />
								<btn-download class="w-5/12 lg:w-3/12" />							
							</div>
							
						</div>
						
						<div class="grid gap-3">

							<span class="text-center text-sm text-gray-400">{{ $t('error_text_3') }}</span>						

							<div class="w-full flex items-center justify-center gap-3">						
								<btn-wipe class="w-5/12 lg:w-3/12" />
							</div>
								
						</div>
						
					</div>
				</UCard>
			</div>

		</div>
		
		<div v-else-if="status == 'loaded'" class="w-full h-full">
		
			<NuxtLoadingIndicator color="#ffb900" />
			
			<NuxtLayout>	
				<NuxtPage />
			</NuxtLayout>
			
		</div>
		
	</UApp>
	
</template>
