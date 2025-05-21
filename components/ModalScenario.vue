<script setup>

	const props = defineProps([ 'scenario' ])
	
	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
    
	const loading = ref(false)
	
	const doClick = () => {
	
		loading.value = true
	
		localStorage.removeItem(store.localStorageName)

		store.activeTab = '0'
		store.currentScenarioId = props.scenario.id
		store.lastFrameTimeMs = null
		store.lastSavedTime = performance.now()
		store.paused = false
		store.resetInProgress = false
		store.timePlayed = 0

		store.elems = []
		
		store.victory = false
		store.victoryReqs = null
		
        window.location.replace('/fgfactory/')
	}
	
</script>

<template>

    <UModal :close="{ onClick:() => emit('close', false) }">
        <template #content>
			<div class="p-3 flex flex-col items-center gap-4">
				
				<span class="text-lg font-bold text-center">{{ $t(scenario.title) }}</span>
				
				<UAlert class="justify-center text-center" :title="$t('scenarios_disclaimer')" color="error" variant="subtle" icon="i-lucide-badge-alert" />
				
				<UButton :loading="loading" class="w-5/12 lg:w-3/12 justify-center" color="neutral" variant="subtle" :label="$t('word_select')" @click="doClick()" />
				
			</div>
        </template>
    </UModal>

</template>