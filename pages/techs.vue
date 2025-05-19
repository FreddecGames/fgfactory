<script setup>

	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const groups = computed(() => [...new Set(store.elems.filter(e => e.type == 'tech').map(e => e.group))])
	
</script>

<template>

	<div class="flex flex-col gap-6">		
		<group-techs v-for="group in groups" :key="group" :group="group" />		
	</div>
	
</template>
