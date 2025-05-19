<script setup>
	
	const props = defineProps([ 'id', 'count' ])
	
	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const item = computed(() => store.elems.find(e => e.id == props.id))

	const color = computed(() => {
	
		if (item.value.count >= props.count) return 'success'
		else return 'error'
	})

</script>

<template>
	
	<UTooltip :text="$t(item.label)" :delay-duration="0">
		<UChip size="3xl" :color="color" position="bottom-right" :text="count.toLocaleString()">
			<UButton :avatar="{ src:item.img }" :color="color" variant="subtle" :to="'/item/' + item.id">
				<UIcon v-if="item.unlocked == false" name="i-lucide-lock-keyhole" class="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2" />
			</UButton>
		</UChip>
	</UTooltip>
	
</template>
