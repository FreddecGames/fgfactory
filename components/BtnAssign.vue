<script setup>
	
	const props = defineProps([ 'id' ])

	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const elem = computed(() => store.elems.find(e => e.id == props.id))

	const can = computed(() => {
		
		if (elem.value.status && elem.value.status != 'stopped') return false
		
		let assignee = store.elems.find(e => e.id == elem.value.assignId)
		if (assignee.availableCount < elem.value.selectCount) return false
		
		return true
	})
	
	function doClick() {
	
		if (!can.value) return
		
		elem.value.assignCount += elem.value.selectCount
		
		store.onAssign(elem.value, elem.value.selectCount)
	}
	
</script>

<template>
	
	<UTooltip :text="$t('word_assign')" :delay-duration="0">
		<UButton icon="i-lucide-plus-circle" color="primary" variant="subtle" :disabled="!can" @click="doClick()" />
	</UTooltip>
	
</template>
