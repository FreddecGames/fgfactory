<script setup>

	const props = defineProps([ 'group' ])

	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const techs = computed(() => store.elems.filter(e => e.type == 'tech' && e.group == props.group))
	
</script>

<template>

	<div class="flex flex-col gap-3">		

		<span class="opacity-50 font-semibold text-xs">{{ $t('group_' + group) }}</span>

		<card-mission v-for="tech in techs" :key="tech.id" :id="tech.id" />		
		
	</div>
	
</template>
