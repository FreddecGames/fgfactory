<script setup>
	
	const props = defineProps([ 'id' ])
	
	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const elem = computed(() => store.elems.find(e => e.id == props.id))

	const values = computed(() => {
	
		let ret = []
		
		ret.push({ label:'1', value:1 })
		ret.push({ label:'5', value:5 })
		ret.push({ label:'10', value:10 })
		ret.push({ label:'50', value:50 })
		
		return ret
	})

</script>

<template>
	
	<USelectMenu v-model="elem.selectCount" value-key="value" :items="values" :search-input="false" class="justify-center" />
	
</template>
