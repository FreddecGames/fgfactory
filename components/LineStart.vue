<script setup>
	
	const props = defineProps([ 'id' ])
	
	import { useAppStore, formatTime } from '~/store.js'    
	const store = useAppStore()
	
	const elem = computed(() => store.elems.find(e => e.id == props.id))
	
	const seconds = computed(() => {
		
		if (elem.value.status == 'stopped') {
		
			if (elem.value.type == 'manual') return formatTime(elem.value.seconds * elem.value.assignCount)
			else return formatTime(elem.value.seconds)
		}
		
		return formatTime(elem.value.remainingSeconds)
	})
	
	const percent = computed(() => {
		
		if (elem.value.status == 'stopped') return 0
		
		if (elem.value.type == 'manual') return (100 - Math.floor(100 * elem.value.remainingSeconds / (elem.value.seconds * elem.value.assignCount)))
		return (100 - Math.floor(100 * elem.value.remainingSeconds / elem.value.seconds))
	})
	
</script>

<template>
	
	<div class="flex items-center gap-2">
	
		<btn-manual v-if="elem.type == 'manual' && elem.counts.length > 1" :id="elem.id" />
		
		<div class="flex-1 grid gap-1 text-end" style="width:75px;">
			<span class="text-xs">{{ seconds }}</span>
			<UProgress size="xs" v-model="percent" />
		</div>
	
		<btn-start v-if="elem.status == 'stopped'" :id="elem.id" />
		<btn-stop v-else :id="elem.id" />
		
	</div>
	
</template>
