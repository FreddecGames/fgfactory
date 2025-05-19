<script setup>
	
	const props = defineProps([ 'id' ])

	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const elem = computed(() => store.elems.find(e => e.id == props.id))

	const can = computed(() => {
		
		if (elem.value.assignCount <= 0) return false
		
		if (elem.value.type == 'storage') {
		
			let item = store.elems.find(e => e.id == elem.value.itemId)
			if (item.count > item.max - (elem.value.stack * elem.value.selectCount)) return false
		}
		
		return true
	})
	
	function doClick() {
	
		if (!can.value) return
		
		elem.value.assignCount -= elem.value.selectCount
		
		store.onUnassign(elem.value, elem.value.selectCount)
	}
	
</script>

<template>
	
	<UTooltip :text="$t('word_unassign')" :delay-duration="0">
		<UButton icon="i-lucide-minus-circle" color="error" variant="subtle" :disabled="!can" @click="doClick()" />
	</UTooltip>
	
</template>
