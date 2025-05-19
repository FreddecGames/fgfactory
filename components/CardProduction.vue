<script setup>
	
	const props = defineProps([ 'id' ])

	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const elem = computed(() => store.elems.find(e => e.id == props.id))
	
	const assignee = computed(() => store.elems.find(e => e.id == elem.value.assignId))
	
</script>

<template>
	
	<UCard v-if="assignee.unlocked == false" variant="outline">		
		<div class="flex items-center gap-2">				
			<btn-requirements :id="assignee.id" />
			<span class="text-lg font-semibold opacity-50">{{ $t('word_production') }}</span>				
		</div>			
	</UCard>
	
	<UCard v-else variant="outline">
		<div class="grid gap-3">

			<span class="text-lg font-semibold">{{ $t('word_production') }}</span>
			
			<div class="grid lg:grid-cols-2 gap-3 items-start">
			
				<div class="p-3 rounded bg-zinc-800 grid gap-3">
				
					<span class="text-xs font-semibold opacity-75">{{ $t('word_assignment') }}</span>
					
					<div class="grid gap-3">
						<line-assignment :id="elem.id" />
					</div>
					
				</div>
				
				<div class="p-3 rounded bg-zinc-800 grid gap-3">
				
					<span class="text-xs font-semibold opacity-75">{{ $t('word_crafting') }}</span>					
					
					<div class="grid gap-3">
						<line-recipe :id="elem.id" />
						<line-start :id="elem.id" />
					</div>
					
				</div>
				
			</div>
			
		</div>
	</UCard>
	
</template>
