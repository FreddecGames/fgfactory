<script setup>
	
	const props = defineProps([ 'id' ])
	
	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const assignment = computed(() => store.elems.find(e => e.id == props.id))

	const assignee = computed(() => store.elems.find(e => e.id == assignment.value.assignId))
	
</script>

<template>
	
	<div class="flex items-center gap-2">
	
		<btn-assignee :id="assignee.id" />
		
		<UBadge variant="subtle" color="neutral" class="ms-auto text-nowrap">
			<small class="opacity-75">x</small> {{ assignment.assignCount }}
		</UBadge>
		
		<UButtonGroup>
			<btn-unassign :id="assignment.id" />
			<btn-select :id="assignment.id" class="w-24" />
			<btn-assign :id="assignment.id" />
		</UButtonGroup>
		
	</div>
	
</template>
