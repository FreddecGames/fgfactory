<script setup lang="ts">

	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

	const props = defineProps<{
		storageId: string
	}>()

	const storage = computed(() => { return gameStore.storages.find(s => s.id === props.storageId) })

	const item = computed(() => { return gameStore.items.find(i => i.id === storage.value.itemId) })

</script>

<template>

	<div class="min-w-0 space-y-1">

		<div class="flex items-center justify-between gap-2">

			<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.storage') }}</h4>

			<div v-if="gameStore.itemUnlockeds[storage.storerId]" class="flex items-center gap-1">
				<UButton v-for="count in item.storageCounts" size="xs"
					:variant="item.storageSelectedCount == count ? 'subtle' : 'soft'"
					:color="item.storageSelectedCount == count ? 'primary' : 'neutral'"
					@click="item.storageSelectedCount = count">
					<span class="text-[10px]">+{{ count * storage.capacity }}</span>
				</UButton>
			</div>

		</div>

		<div v-if="gameStore.itemUnlockeds[storage.storerId]" class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 ps-2 pe-1 py-1.5">

			<div class="flex min-w-0 items-center gap-2">

				<UButton color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
					:avatar="{ src:gameStore.itemImgs[storage.storerId] }"
					:label="$t(`items.${storage.storerId}`)"
					@click="gameStore.openMachine(storage.storerId)" />

			</div>								

			<div class="flex items-center gap-2">

				<UBadge v-if="gameStore.itemAvailableCounts[storage.storerId] > 0" variant="subtle" color="success" size="sm">{{ gameStore.itemAvailableCounts[storage.storerId] }}</UBadge>
				<UBadge v-else variant="subtle" color="neutral" size="sm">{{ gameStore.itemAvailableCounts[storage.storerId] }}</UBadge>

				<UButton :color="storage.assignedCount > 0 ? 'error' : 'neutral'" variant="subtle" icon="i-lucide-minus" size="xs"
					:disabled="storage.assignedCount <= 0"
					@click="gameStore.unassignStorageStorer(item.storage, 1)" />

				<span v-if="storage.assignedCount > 0" class="min-w-10 text-center text-xs">{{ storage.assignedCount }}</span>
				<span v-else class="min-w-10 text-center text-xs text-muted">{{ storage.assignedCount }}</span>

				<UButton :color="gameStore.itemAvailableCounts[storage.storerId] > 0 ? 'primary' : 'neutral'" variant="subtle" icon="i-lucide-plus" size="xs"
					:disabled="gameStore.itemAvailableCounts[storage.storerId] <= 0"
					@click="gameStore.assignStorageStorer(item.storage, 1)" />

			</div>

		</div>
		<div v-else class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 ps-2 pe-1 py-1.5">

			<UButton color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
				icon="i-lucide-lock"
				:label="$t(`items.${storage.storerId}`)"
				@click="gameStore.openMachine(storage.storerId)" />

		</div>

	</div>

</template>