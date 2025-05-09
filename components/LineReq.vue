<script setup>
	
	const props = defineProps([ 'id' ])
	
	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const elem = computed(() => store.elems.find(e => e.id == props.id))

</script>

<template>
	
	<div v-if="elem.count > 0" class="flex items-center gap-2 text-success opacity-50"><UIcon name="i-lucide-check" /> {{ $t(elem.label) }}</div>
	<div v-else-if="elem.unlocked">{{ $t(elem.label) }}</div>
	<div v-else class="flex items-center gap-2 opacity-50"><UIcon name="i-lucide-lock-keyhole" /> {{ $t(elem.label) }}</div>
	
</template>
