<script setup lang="ts">

	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

	const props = defineProps<{
		prodId: string
	}>()

	const prod = computed(() => { return gameStore.prods.find(p => p.id === props.prodId) })

	const item = computed(() => { return gameStore.items.find(i => i.id === prod.value.itemId) })

</script>

<template>

	<div class="min-w-0 space-y-1">

		<div class="flex items-center justify-between gap-2">

			<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.prod') }}</h4>

			<div class="flex items-center gap-1">
				<UButton v-for="count in item.prodCounts" size="xs"
					:variant="item.prodSelectedCount == count ? 'subtle' : 'soft'"
					:color="item.prodSelectedCount == count ? 'primary' : 'neutral'"
					@click="item.prodSelectedCount = count">
					<span class="text-[10px]">+{{ count * prod.outputCount }} /s</span>
				</UButton>
			</div>

		</div>

		<div v-if="gameStore.itemUnlockeds[prod.machineId]" class="space-y-1">

			<div v-if="prod.inputs && prod.inputs.length > 0" class="space-y-1">
				<div v-for="input in prod.inputs" :key="input.id"
					class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 px-2 py-1.5">

						<UButton color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
							:avatar="{ src:gameStore.itemImgs[input.id] }"
							:label="$t(`items.${input.id}`)"
							@click="gameStore.openItem(input.id)" />
						
						<span v-if="gameStore.itemProds[input.id] >= input.count * item.prodSelectedCount" class="text-success text-xs">{{ gameStore.itemProds[input.id] }} / {{ input.count * item.prodSelectedCount }} /s</span>
						<span v-else class="text-error text-xs">{{ gameStore.itemProds[input.id] }} / {{ input.count * item.prodSelectedCount }} /s</span>

				</div>
			</div>
			<div v-else class="flex-1">
				<span class="text-muted text-xs italic">{{ $t('modalItem.noInputs') }}</span>
			</div>

			<div class="rounded-md bg-neutral-800 p-2 flex w-full min-w-0 max-w-full items-center justify-between gap-3">

				<div class="flex min-w-0 items-center gap-2">

					<UButton color="neutral" variant="link" size="xs" class="min-w-0 flex-1 justify-start overflow-hidden p-0 gap-2"
						:ui="{ label: 'block min-w-0 truncate' }"
						:avatar="{ src:gameStore.itemImgs[prod.machineId] }"
						:label="$t(`items.${prod.machineId}`)"
						@click="gameStore.openMachine(prod.machineId)" />

					<UBadge v-if="gameStore.itemAvailableCounts[prod.machineId] > 0" variant="subtle" color="success" size="sm">{{ gameStore.itemAvailableCounts[prod.machineId] }}</UBadge>
					<UBadge v-else variant="subtle" color="neutral" size="sm" class="text-muted">{{ gameStore.itemAvailableCounts[prod.machineId] }}</UBadge>

				</div>

				<div class="flex shrink-0 items-center gap-2">

					<div class="flex items-center gap-2">

						<UButton :color="prod.assignedCount > 0 ? 'error' : 'neutral'" variant="subtle" icon="i-lucide-minus" size="xs"
							:disabled="prod.assignedCount <= 0"
							@click="gameStore.unassignProdMachine(item.prod, 1)" />

						<span v-if="prod.assignedCount > 0" class="min-w-10 text-center text-xs">{{ prod.assignedCount }}</span>
						<span v-else class="min-w-10 text-center text-xs text-muted">{{ prod.assignedCount }}</span>

						<UButton :color="gameStore.canAssignProdMachine(item.prod, item.prodSelectedCount) === 0 ? 'primary' : 'neutral'" variant="subtle" icon="i-lucide-plus" size="xs"
							:disabled="gameStore.canAssignProdMachine(item.prod, item.prodSelectedCount) !== 0"
							@click="gameStore.assignProdMachine(item.prod, item.prodSelectedCount)" />

					</div>

				</div>
			</div>

		</div>
		<div v-else class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 ps-2 pe-1 py-1.5">

			<UButton color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
				icon="i-lucide-lock"
				:label="$t(`items.${prod.machineId}`)"
				@click="gameStore.openMachine(prod.machineId)" />

		</div>

	</div>

</template>