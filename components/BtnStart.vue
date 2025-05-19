<script setup>
	
	const props = defineProps([ 'id' ])

	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const elem = computed(() => store.elems.find(e => e.id == props.id))

	const can = computed(() => {
		
		if (elem.value.assignCount <= 0) return false
		
		if (elem.value.status != 'stopped') return false
		
		if (elem.value.type == 'manual') {
			
			let ret = true
			
			let inputs = elem.value.getInputs()
			if (inputs) {
			
				inputs.forEach(input => {
					
					let inputElem = store.elems.find(e => e.id == input.id)
					if (inputElem.count < input.count) ret = false
				})
			}
			
			let outputs = elem.value.getOutputs()
			outputs.forEach(output => {
				
				let outputElem = store.elems.find(e => e.id == output.id)
				if (outputElem.count >= outputElem.max) ret = false
			})
			
			if (!ret) return false
		}
		
		return true
	})
	
	function doClick() {
	
		if (!can.value) return

		if (elem.value.type == 'manual') {
			
			let inputs = elem.value.getInputs()
			if (inputs) {
			
				inputs.forEach(input => {
					
					let inputElem = store.elems.find(e => e.id == input.id)
					inputElem.count -= input.count
				})
			}
		}
		
		elem.value.status = 'waiting'
		
		if (elem.value.type == 'manual') elem.value.remainingSeconds = elem.value.seconds * elem.value.assignCount
		else elem.value.remainingSeconds = elem.value.seconds
	}

</script>

<template>
	
	<UTooltip :text="$t('word_start')" :delay-duration="0">
		<UButton icon="i-lucide-play" color="primary" variant="subtle" :disabled="!can" @click="doClick()" />
	</UTooltip>
	
</template>
