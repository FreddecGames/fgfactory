<script setup>
	
	const props = defineProps([ 'id' ])

	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const elem = computed(() => store.elems.find(e => e.id == props.id))

	const manual = computed(() => store.elems.find(e => e.type == 'manual' && e.itemId == props.id))
	
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
	
	<UCard v-if="elem.count >= elem.max" variant="outline">
		<div class="flex items-center gap-2">				
			<span class="text-lg font-semibold text-success opacity-50">{{ $t(elem.label) }}</span>				
			<UBadge variant="subtle" color="success" icon="i-lucide-check" class="ms-auto" />
		</div>
	</UCard>
	
	<UCard v-else-if="elem.unlocked == false" variant="outline">
		<div class="flex items-center gap-2">				
			<btn-requirements :id="elem.id" />
			<span class="text-lg font-semibold opacity-50">{{ $t(elem.label) }}</span>				
		</div>
	</UCard>
		
	<UCard v-else variant="outline">
		<div class="grid gap-3">
		
			<div class="grid gap-2">
			
				<div class="flex items-center gap-2">			

					<span class="text-lg font-semibold">{{ $t(elem.label) }}</span>

					<div class="ms-auto flex items-center gap-2">
						<elem-count-page :id="elem.id" />
					</div>
					
				</div>
				
				<span v-if="elem.desc" class="text-xs opacity-75">{{ $t(elem.desc) }}</span>
				
			</div>
			
			<div v-if="manual" class="p-3 rounded bg-zinc-800 grid gap-3">

				<span class="text-xs font-semibold opacity-75">{{ $t('word_costs') }}</span>

				<div class="grid gap-3 lg:grid-cols-4">
					<line-costs :id="manual.id" class="lg:col-span-3" />
					<line-start :id="manual.id" />
				</div>
				
			</div>
			
		</div>
	</UCard>
	
</template>
