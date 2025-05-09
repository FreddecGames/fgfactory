<script setup>
	
	const props = defineProps([ 'id' ])

	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const elem = computed(() => store.elems.find(e => e.id == props.id))
	
	const reqs = computed(() => {
	
		let ret = []
		
		elem.value.reqs.forEach(req => {
		
			let reqElem = store.elems.find(e => e.id == req.id)
			ret.push({ id:req.id, label:reqElem.label })
		})
		
		return ret
	
	})
	
</script>

<template>
	
	<UCard v-if="elem.count > 0" variant="outline">
		<div class="grid gap-6">
		
			<div class="flex items-center gap-2">				
				<span class="text-lg font-semibold text-success opacity-50">{{ $t(elem.label) }}</span>				
				<UBadge variant="subtle" color="success" icon="i-lucide-check" class="ms-auto" />
			</div>
			
		</div>
	</UCard>
	
	<UCard v-else-if="elem.unlocked == false" variant="outline">
		<div class="grid gap-6">
		
			<div class="flex items-center gap-2">				
				<btn-requirements :id="elem.id" />
				<span class="text-lg font-semibold opacity-50">{{ $t(elem.label) }}</span>				
			</div>
			
		</div>
	</UCard>
		
	<UCard v-else variant="outline">
		<div class="grid gap-6">
		
			<div class="grid gap-2">
			
				<div class="flex items-center gap-2">			
					<span class="text-lg font-semibold">{{ $t(elem.label) }}</span>				
				</div>
				
				<span v-if="elem.desc" class="text-xs opacity-75">{{ $t(elem.desc) }}</span>
				
			</div>
			
			<div class="grid gap-2">

				<span class="text-xs font-semibold opacity-75">{{ $t('word_costs') }}</span>
				
				<div class="p-2 rounded bg-zinc-800 flex gap-2 items-end">
					<line-costs :id="elem.id" class="flex-1" />
					<line-complete :id="elem.id" />
				</div>
				
			</div>
			
		</div>
	</UCard>
	
</template>
