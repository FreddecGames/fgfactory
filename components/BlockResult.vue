<script setup>
    
    const props = defineProps([ 'id', 'count' ])
	
    import { formatNumber } from '~/store/utils.js'    

    import { useGameStore } from '~/store/gameStore.js'    
    const gameStore = useGameStore()
    
    const elem = computed(() => gameStore.getElem(props.id))
    
</script>

<template>
    
	<div class="row gx-2 align-items-center justify-content-end">

		<div class="col text-truncate text-end">{{ $t(elem.name) }}</div>
		<div v-if="elem.img != undefined" class="col-auto" :title="$t(elem.name)"><img :src="elem.img" width="16" height="16" /></div>
		
		<div class="col-auto">
			<span class="badge d-block" :class="{ 'text-bg-dark':elem.count + count <= elem.max, 'text-bg-danger':elem.count + count > elem.max }" style="width:55px;">+ {{ formatNumber(count) }}</span>
		</div>
		
	</div>
    
</template>
