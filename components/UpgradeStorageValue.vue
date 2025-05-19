<script setup>

	const props = defineProps([ 'id' ])

	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const storer = computed(() => store.elems.find(e => e.id == props.id))
	
	const value = computed(() => {
	
		let item = store.elems.find(e => e.id == storer.value.itemId)
		return item.stack * storer.value.slots * storer.value.selectCount
	})
	
</script>

<template>
	
	<span>+{{ value.toLocaleString() }}</span>
	
</template>
