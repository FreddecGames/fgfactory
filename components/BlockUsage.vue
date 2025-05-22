<script setup>
	
	const props = defineProps([ 'id' ])

	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const elem = computed(() => store.elems.find(e => e.id == props.id))
	
</script>

<template>
	
	<div class="p-3 rounded bg-zinc-800 grid gap-3 lg:grid-cols-3">
		<line-recipe :id="elem.id" class="lg:col-span-2" />
		<line-start :id="elem.id" />
	</div>
	
</template>
