<script setup>
	
	const props = defineProps([ 'id' ])
	
	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const elem = computed(() => store.elems.find(e => e.id == props.id))

	const values = computed(() => {
	
		let ret = []
		
		elem.value.counts.forEach(count => {
		
			if (count == 1) ret.push({ label:'1', value:1 })
			else if (count == 5) ret.push({ label:'5', value:5 })
			else if (count == 10) ret.push({ label:'10', value:10 })
			else if (count == 50) ret.push({ label:'50', value:50 })
			else if (count == 100) ret.push({ label:'100', value:100 })
			else if (count == 500) ret.push({ label:'500', value:500 })
			else if (count == 1000) ret.push({ label:'1000', value:1000 })
		})
		
		return ret
	})

</script>

<template>
	
	<USelectMenu v-model="elem.assignCount" value-key="value" :items="values" :search-input="false" :disabled="elem.status != 'stopped'" class="justify-center" />
	
</template>
