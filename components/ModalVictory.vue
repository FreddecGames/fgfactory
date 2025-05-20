<script setup>
	
</script>

<template>

    <UModal :close="{ onClick:() => emit('close', false) }">
        <template #content>
			<div class="p-3 flex flex-col items-center gap-4">

				<span class="text-lg">{{ $t('victory_title') }}</span>
				
				<span class="text-gray-400">{{ $t('victory_text') }}</span>
                    
				<img src="/victory.png" width="48" height="48" />
                
				<UButton class="w-5/12 lg:w-3/12 justify-center" color="neutral" variant="subtle" :label="$t('word_close')" @click="$emit('close', false)" />
				
			</div>
        </template>
    </UModal>

</template>
