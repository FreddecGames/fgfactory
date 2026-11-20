<script setup lang="ts">

	import { computed } from 'vue'
	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

	const props = defineProps<{
		itemId: string
	}>()

	const item = computed(() => {
		
		return gameStore.itemMap[props.itemId]
	})

	function getManualProgress(manual: any): number {

		const totalDuration = manual.seconds * manual.processCount
		if (!manual.isProcessing || totalDuration <= 0) return 0

		return Math.min(100, Math.max(0, ((totalDuration - manual.remainingSeconds) / totalDuration) * 100))
	}

</script>

<template>

	<div class="flex flex-col space-y-1">

		<div class="flex items-center justify-between gap-2">

			<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.manuals') }}</h4>

			<div class="flex items-center gap-1">
				<UButton v-for="count in item.manualCounts" size="xs"
					:variant="item.manualSelectedCount == count ? 'subtle' : 'soft'"
					:color="item.manualSelectedCount == count ? 'primary' : 'neutral'"
					@click="item.manualSelectedCount = count">
					<span class="text-[10px]">x{{ count }}</span>
				</UButton>
			</div>

		</div>

		<div v-if="item.manual.inputs && item.manual.inputs.length > 0" class="flex flex-col gap-1">
			<div v-for="input in item.manual.inputs" :key="input.id"
				class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 px-2 py-1.5">

					<UButton color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
						:avatar="{ src:gameStore.itemImgs[input.id] }"
						:label="$t(`items.${input.id}`)"
						@click="gameStore.openItem(input.id)" />
					
					<span v-if="gameStore.itemCounts[input.id] >= input.count * item.manualSelectedCount" class="text-success text-xs">{{ gameStore.itemCounts[input.id].toFixed(0) }} / {{ input.count.toFixed(0) * item.manualSelectedCount }}</span>
					<span v-else class="text-error text-xs">{{ gameStore.itemCounts[input.id].toFixed(0) }} / {{ input.count.toFixed(0) * item.manualSelectedCount }}</span>

			</div>
		</div>
		<div v-else class="flex-1">
			<span class="text-muted text-xs italic">{{ $t('modalItem.noManualInputs') }}</span>
		</div>

		<div class="rounded-md bg-neutral-800 p-2 flex items-center gap-2">

			<div class="flex-1 flex flex-col items-end gap-1">

				<div class="w-full flex justify-between gap-2">
					<span class="text-success text-xs">+{{ item.manual.outputCount * item.manualSelectedCount }}</span>
					<span v-if="item.manual.isProcessing" class="text-end text-xs text-primary">{{ formatTime(item.manual.remainingSeconds) }}</span>
					<span v-else class="text-end text-xs text-muted">{{ formatTime(item.manual.seconds * item.manualSelectedCount) }}</span>
				</div>

				<UProgress :model-value="getManualProgress(item.manual)" size="sm" color="primary" class="flex-1" />

			</div>
			
			<UButton v-if="item.manual.isProcessing" color="error" variant="subtle" icon="i-lucide-square" size="sm"
				@click="gameStore.cancelManual(item.manual)" />
			
			<UButton v-else-if="gameStore.canStartManual(item.manual, item.manualSelectedCount) === 0" color="primary" variant="subtle" icon="i-lucide-play" size="sm"
				@click="gameStore.startManual(item.manual, item.manualSelectedCount)" />

			<UButton v-else color="neutral" variant="subtle" icon="i-lucide-play" disabled  size="sm" />

		</div>

	</div>


</template>