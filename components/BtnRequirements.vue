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
	
	<UPopover mode="hover">

		<UButton icon="i-lucide-lock-keyhole" color="neutral" variant="outline" class="opacity-50" />

		<template #content>
			<div class="w-48 p-2 grid gap-2">
				
				<span class="text-xs font-semibold opacity-75">{{ $t('word_requirements') }}</span>				
				<span v-for="req in reqs" :key="req.id">{{ $t(req.label) }}</span>
				
			</div>
		</template>

	</UPopover>
	
</template>
