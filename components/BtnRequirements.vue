<script setup>
	
	const props = defineProps([ 'id' ])
	
	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const elem = computed(() => store.elems.find(e => e.id == props.id))

</script>

<template>
	
	<UPopover mode="hover">

		<UButton icon="i-lucide-lock-keyhole" color="neutral" variant="outline" class="opacity-50" />

		<template #content>
			<div class="w-48 p-2 grid gap-2">
				
				<span class="text-xs font-semibold opacity-75">{{ $t('word_requirements') }}</span>				
				<line-req v-for="req in elem.reqs" :key="req.id" :id="req.id" />
				
			</div>
		</template>

	</UPopover>
	
</template>
