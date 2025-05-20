<script setup>

	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const scenarios = computed(() => store.scenarios)
	
	import ModalScenario from '~/components/ModalScenario.vue'

	const overlay = useOverlay()
	
	const selectScenario = (scenario) => {
	
		let modalScenario = overlay.create(ModalScenario, { props:{ scenario:scenario } })
		modalScenario.open()
	}
	
	const hasVictory = (scenario) => {
	
		return store.completedScenarios.includes(scenario.id)
	}
	
</script>
	
<template>
	
	<UCard variant="outline">
		<div class="grid gap-3">
			
			<span class="truncate text-lg font-bold">{{ $t('scenarios_text') }}</span>
			
			<div v-for="scenario in scenarios" :key="scenario.id" class="p-3 rounded bg-zinc-800 grid gap-3">
				
				<div class="grid gap-2">
				
					<div class="flex items-center gap-2">
						<span class="truncate font-semibold">{{ $t(scenario.title) }}</span>
						<img v-if="hasVictory(scenario)" src="/victory.png" width="16" height="16" class="ms-auto" />
					</div>
					
					<span class="text-xs opacity-75">{{ $t(scenario.desc) }}</span>
				
				</div>
				
				<div class="flex items-center gap-2 justify-end">
					<UButton variant="subtle" color="primary" @click.prevent="selectScenario(scenario)" truncate :label="$t('word_select')" />
				</div>
				
			</div>
		
		</div>
	</UCard>
	
</template>