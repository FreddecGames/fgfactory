<script setup>
	
	const props = defineProps([ 'id' ])

	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const elem = computed(() => store.elems.find(e => e.id == props.id))

	const can = computed(() => {
		
		if (elem.value.count > 0) return false
		
		let ret = true
		
		let costs = elem.value.getCosts()
		if (costs) {
		
			costs.forEach(cost => {
				
				let costElem = store.elems.find(e => e.id == cost.id)
				if (costElem.count < cost.count) ret = false
			})
		}
		
		return ret
	})
	
	function doClick() {
	
		if (!can.value) return

		let costs = elem.value.getCosts()
		if (costs) {
		
			costs.forEach(cost => {
				
				let costElem = store.elems.find(e => e.id == cost.id)
				costElem.count -= cost.count
			})
		}
		
		elem.value.count = 1
		
		store.refreshAll()
	}

</script>

<template>
	
	<UTooltip :text="$t('word_complete')" :delay-duration="0">
		<UButton icon="i-lucide-check" color="success" variant="subtle" :disabled="!can" @click="doClick()" />
	</UTooltip>
	
</template>
