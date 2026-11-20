<script setup lang="ts">

	import { computed } from 'vue'
	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

	const props = defineProps<{
		linkId: string
	}>()

	const link = computed(() => {
		
		return gameStore.linkMap[props.linkId]
	})

</script>

<template>

	<div v-if="gameStore.linkUnlockeds[link.id]" class="space-y-1.5 rounded-md bg-neutral-800 ps-2 pe-2 py-1.5">

		<div class="flex items-center justify-between gap-2">

			<div class="flex items-center gap-1.5">

				<UTooltip :text="$t(`items.${link.sourceId}`)">
					<UButton color="neutral" variant="link" size="xs" class="p-0"
						:avatar="{ src:gameStore.itemImgs[link.sourceId] }"
						@click="gameStore.openItem(link.sourceId)" />
				</UTooltip>

				<UIcon name="i-lucide-move-right" class="text-muted" />

				<UTooltip :text="$t(`items.${link.targetId}`)">
					<UButton color="neutral" variant="link" size="xs" class="p-0"
						:avatar="{ src:gameStore.itemImgs[link.targetId] }"
						@click="gameStore.openItem(link.targetId)" />
				</UTooltip>

			</div>

			<span v-if="link.assignedCount <= 0 && gameStore.linkMiniumRates[link.id] <= 0" class="text-xs font-semibold text-muted">{{ link.assignedCount * link.conveyorSpeed }} / {{ gameStore.linkMiniumRates[link.id] }} /s</span>
			<span v-else-if="link.assignedCount * link.conveyorSpeed >= gameStore.linkMiniumRates[link.id]" class="text-xs font-semibold text-success">{{ link.assignedCount * link.conveyorSpeed }} / {{ gameStore.linkMiniumRates[link.id] }} /s</span>
			<div v-else class="flex flex-items gap-2">
				<UIcon name="i-lucide-triangle-exclamation-point" class="text-error" />
				<span class="text-xs font-semibold text-error">{{ link.assignedCount * link.conveyorSpeed }} / {{ gameStore.linkMiniumRates[link.id] }} /s</span>
			</div>

		</div>

		<div class="flex min-w-0 items-center justify-between gap-2">

			<UButton color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
				:avatar="{ src:gameStore.itemImgs[link.conveyorId] }"
				:label="$t(`items.${link.conveyorId}`)"
				@click="gameStore.openMachine(link.conveyorId)" />

			<div class="flex items-center gap-2">

				<UBadge v-if="gameStore.itemAvailableCounts[link.conveyorId] > 0" variant="subtle" color="success" size="sm">{{ gameStore.itemAvailableCounts[link.conveyorId] }}</UBadge>
				<UBadge v-else variant="subtle" color="neutral" size="sm" class="text-muted">{{ gameStore.itemAvailableCounts[link.conveyorId] }}</UBadge>

				<UButton :color="link.assignedCount > 0 ? 'error' : 'neutral'" variant="subtle" icon="i-lucide-minus" size="xs"
					:disabled="link.assignedCount <= 0"
					@click="gameStore.unassignLinkConveyor(link, 1)" />

				<span v-if="link.assignedCount > 0" class="min-w-10 text-center text-xs">{{ link.assignedCount }}</span>
				<span v-else class="min-w-10 text-center text-xs text-muted">{{ link.assignedCount }}</span>

				<UButton :color="gameStore.itemAvailableCounts[link.conveyorId] > 0 ? 'primary' : 'neutral'" variant="subtle" icon="i-lucide-plus" size="xs"
					:disabled="gameStore.itemAvailableCounts[link.conveyorId] <= 0"
					@click="gameStore.assignLinkConveyor(link, 1)" />

			</div>

		</div>

	</div>
	<div v-else class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 ps-2 pe-1 py-1.5">
		
		<UButton v-if="!gameStore.itemUnlockeds[link.conveyorId]" color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
			icon="i-lucide-lock"
			:label="$t(`items.${link.conveyorId}`)"
			@click="gameStore.openMachine(link.conveyorId)" />

		<UButton v-else-if="!gameStore.itemUnlockeds[link.sourceId]" color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
			icon="i-lucide-lock"
			:label="$t(`items.${link.sourceId}`)"
			@click="gameStore.openItem(link.sourceId)" />

		<UButton v-else-if="!gameStore.itemUnlockeds[link.targetId]" color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
			icon="i-lucide-lock"
			:label="$t(`items.${link.targetId}`)"
			@click="gameStore.openItem(link.targetId)" />

	</div>

</template>