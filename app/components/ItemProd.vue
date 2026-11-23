<script setup lang="ts">

	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

</script>

<template>

	<div class="min-w-0 space-y-1">

		<div class="flex items-center justify-between gap-2">

			<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.prod') }}</h4>

			<div class="flex items-center gap-1">
				<UButton v-for="count in gameStore.selectedItem.prodCounts" size="xs"
					:variant="gameStore.selectedItem.prodSelectedCount == count ? 'subtle' : 'soft'"
					:color="gameStore.selectedItem.prodSelectedCount == count ? 'primary' : 'neutral'"
					@click="gameStore.selectedItem.prodSelectedCount = count">
					<span class="text-[10px]">+{{ count * gameStore.selectedItem.prod.outputCount }} /s</span>
				</UButton>
			</div>

		</div>

		<div v-if="gameStore.itemUnlockeds[gameStore.selectedItem.prod.machineId]" class="space-y-1">

			<div v-if="gameStore.selectedItem.prod.inputs && gameStore.selectedItem.prod.inputs.length > 0" class="space-y-1">
				<div v-for="input in gameStore.selectedItem.prod.inputs" :key="input.id"
					class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 px-2 py-1.5">

						<UButton color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
							:avatar="{ src:gameStore.itemImgs[input.id] }"
							:label="$t(`items.${input.id}`)"
							@click="gameStore.openItem(input.id)" />
						
						<span v-if="gameStore.itemProds[input.id] >= input.count * gameStore.selectedItem.prodSelectedCount" class="text-success text-xs">{{ gameStore.itemProds[input.id] }} / {{ input.count * gameStore.selectedItem.prodSelectedCount }} /s</span>
						<span v-else class="text-error text-xs">{{ gameStore.itemProds[input.id] }} / {{ input.count * gameStore.selectedItem.prodSelectedCount }} /s</span>

				</div>
			</div>
			<div v-else class="flex-1">
				<span class="text-muted text-xs italic">{{ $t('modalItem.noInputs') }}</span>
			</div>

			<div class="rounded-md bg-neutral-800 p-2 flex w-full min-w-0 max-w-full items-center justify-between gap-3">

				<div class="flex min-w-0 items-center gap-2">

					<UButton color="neutral" variant="link" size="xs" class="min-w-0 flex-1 justify-start overflow-hidden p-0 gap-2"
						:ui="{ label: 'block min-w-0 truncate' }"
						:avatar="{ src:gameStore.itemImgs[gameStore.selectedItem.prod.machineId] }"
						:label="$t(`items.${gameStore.selectedItem.prod.machineId}`)"
						@click="gameStore.openMachine(gameStore.selectedItem.prod.machineId)" />

					<UBadge v-if="gameStore.itemAvailableCounts[gameStore.selectedItem.prod.machineId] > 0" variant="subtle" color="success" size="sm">{{ gameStore.itemAvailableCounts[gameStore.selectedItem.prod.machineId] }}</UBadge>
					<UBadge v-else variant="subtle" color="neutral" size="sm" class="text-muted">{{ gameStore.itemAvailableCounts[gameStore.selectedItem.prod.machineId] }}</UBadge>

				</div>

				<div class="flex shrink-0 items-center gap-2">

					<div class="flex items-center gap-2">

						<UButton :color="gameStore.selectedItem.prod.assignedCount > 0 ? 'error' : 'neutral'" variant="subtle" icon="i-lucide-minus" size="xs"
							:disabled="gameStore.selectedItem.prod.assignedCount <= 0"
							@click="gameStore.unassignProdMachine(gameStore.selectedItem.prod, 1)" />

						<span v-if="gameStore.selectedItem.prod.assignedCount > 0" class="min-w-10 text-center text-xs">{{ gameStore.selectedItem.prod.assignedCount }}</span>
						<span v-else class="min-w-10 text-center text-xs text-muted">{{ gameStore.selectedItem.prod.assignedCount }}</span>

						<UButton :color="gameStore.canAssignProdMachine(gameStore.selectedItem.prod, gameStore.selectedItem.prodSelectedCount) === 0 ? 'primary' : 'neutral'" variant="subtle" icon="i-lucide-plus" size="xs"
							:disabled="gameStore.canAssignProdMachine(gameStore.selectedItem.prod, gameStore.selectedItem.prodSelectedCount) !== 0"
							@click="gameStore.assignProdMachine(gameStore.selectedItem.prod, gameStore.selectedItem.prodSelectedCount)" />

					</div>

				</div>
			</div>

		</div>
		<div v-else class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 ps-2 pe-1 py-1.5">

			<UButton color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
				icon="i-lucide-lock"
				:label="$t(`items.${gameStore.selectedItem.prod.machineId}`)"
				@click="gameStore.openMachine(gameStore.selectedItem.prod.machineId)" />

		</div>

	</div>

</template>