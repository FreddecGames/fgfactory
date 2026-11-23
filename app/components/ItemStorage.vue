<script setup lang="ts">

	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

</script>

<template>

	<div class="min-w-0 space-y-1">

		<div class="flex items-center justify-between gap-2">

			<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.storage') }}</h4>

			<div class="flex items-center gap-1">
				<UButton v-for="count in gameStore.selectedItem.storageCounts" size="xs"
					:variant="gameStore.selectedItem.storageSelectedCount == count ? 'subtle' : 'soft'"
					:color="gameStore.selectedItem.storageSelectedCount == count ? 'primary' : 'neutral'"
					@click="gameStore.selectedItem.storageSelectedCount = count">
					<span class="text-[10px]">+{{ count * gameStore.selectedItem.storage.capacity }}</span>
				</UButton>
			</div>

		</div>

		<div v-if="gameStore.itemUnlockeds[gameStore.selectedItem.storage.storerId]" class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 ps-2 pe-1 py-1.5">

			<div class="flex min-w-0 items-center gap-2">

				<UButton color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
					:avatar="{ src:gameStore.itemImgs[gameStore.selectedItem.storage.storerId] }"
					:label="$t(`items.${gameStore.selectedItem.storage.storerId}`)"
					@click="gameStore.openMachine(gameStore.selectedItem.storage.storerId)" />

			</div>								

			<div class="flex items-center gap-2">

				<UBadge v-if="gameStore.itemAvailableCounts[gameStore.selectedItem.storage.storerId] > 0" variant="subtle" color="success" size="sm">{{ gameStore.itemAvailableCounts[gameStore.selectedItem.storage.storerId] }}</UBadge>
				<UBadge v-else variant="subtle" color="neutral" size="sm">{{ gameStore.itemAvailableCounts[gameStore.selectedItem.storage.storerId] }}</UBadge>

				<UButton :color="gameStore.selectedItem.storage.assignedCount > 0 ? 'error' : 'neutral'" variant="subtle" icon="i-lucide-minus" size="xs"
					:disabled="gameStore.selectedItem.storage.assignedCount <= 0"
					@click="gameStore.unassignStorageStorer(gameStore.selectedItem.storage, 1)" />

				<span v-if="gameStore.selectedItem.storage.assignedCount > 0" class="min-w-10 text-center text-xs">{{ gameStore.selectedItem.storage.assignedCount }}</span>
				<span v-else class="min-w-10 text-center text-xs text-muted">{{ gameStore.selectedItem.storage.assignedCount }}</span>

				<UButton :color="gameStore.itemAvailableCounts[gameStore.selectedItem.storage.storerId] > 0 ? 'primary' : 'neutral'" variant="subtle" icon="i-lucide-plus" size="xs"
					:disabled="gameStore.itemAvailableCounts[gameStore.selectedItem.storage.storerId] <= 0"
					@click="gameStore.assignStorageStorer(gameStore.selectedItem.storage, 1)" />

			</div>

		</div>
		<div v-else class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 ps-2 pe-1 py-1.5">

			<UButton color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
				icon="i-lucide-lock"
				:label="$t(`items.${gameStore.selectedItem.storage.storerId}`)"
				@click="gameStore.openMachine(gameStore.selectedItem.storage.storerId)" />

		</div>

	</div>

</template>