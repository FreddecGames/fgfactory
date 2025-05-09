<script setup>
	
	const props = defineProps([ 'id' ])

	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const elem = computed(() => store.elems.find(e => e.id == props.id))
	
	const assignee = computed(() => store.elems.find(e => e.id == elem.value.assignId))
	
</script>

<template>
	
	<UCard v-if="assignee.unlocked == false" variant="outline">
		<div class="grid gap-6">
		
			<div class="flex items-center gap-2">				
				<btn-requirements :id="assignee.id" />
				<span class="text-lg font-semibold opacity-50">{{ $t('word_production') }}</span>				
			</div>
			
		</div>
	</UCard>
	
	<UCard v-else variant="outline">
		<div class="grid gap-6">

			<span class="text-lg font-semibold">{{ $t('word_production') }}</span>
			
			<div class="grid lg:grid-cols-2 gap-6 items-start">
			
				<div class="grid gap-2">
				
					<span class="text-xs font-semibold opacity-75">{{ $t('word_assignment') }}</span>
					
					<div class="p-2 rounded bg-zinc-800 grid gap-2">
						<line-assignment :id="elem.id" />
					</div>
					
				</div>
			
				<div class="grid gap-2">
				
					<span class="text-xs font-semibold opacity-75">{{ $t('word_crafting') }}</span>					
					
					<div class="p-2 rounded bg-zinc-800 grid gap-2">
						<line-recipe :id="elem.id" />
						<line-start :id="elem.id" />
					</div>
					
				</div>
				
			</div>
			
		</div>
	</UCard>
	
</template>
