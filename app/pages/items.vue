<script setup lang="ts">

	import { computed, ref } from 'vue'
	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

	const groupedItems = computed(() => {

		return gameStore.items.filter((item: any) => item.type === 'item').reduce((groups: Record<string, any[]>, item: any) => {
			const group = item.group
			const groupItems = groups[group] || (groups[group] = [])
			groupItems.push(item)
			return groups
		}, {})
	})

	const selectedItem = ref<any | null>(null)
	const isItemModalOpen = ref(false)

	function openItem(item: any) {

		selectedItem.value = item
		isItemModalOpen.value = true
	}

	function getManualProgress(manual: any): number {

		const totalDuration = manual.seconds * manual.processCount
		if (!manual.isProcessing || totalDuration <= 0) return 0

		return Math.min(100, Math.max(0, ((totalDuration - manual.remainingSeconds) / totalDuration) * 100))
	}

</script>

<template>

	<!-- Item Groups -->
	<section v-for="(items, group) in groupedItems" :key="group" class="flex flex-col gap-2">

		<h2 class="text-center text-xs font-semibold text-neutral-400">{{ $t('groups.' + group) }}</h2>

		<div class="flex flex-wrap items-center justify-center gap-2">
			<UTooltip v-for="item in items" :key="item.id" :text="$t(`items.${item.id}`)">
				<UButton color="neutral" variant="subtle" class="relative aspect-square size-10"
					@click="openItem(item)">

					<img :src="gameStore.itemImgs[item.id]" :alt="$t(`items.${item.id}`)" class="size-full object-contain" />

					<UBadge v-if="item.count != 0" size="xs" color="neutral" variant="subtle"
						class="absolute -top-0.5 -right-0.5 z-10">
						<span v-if="item.count >= item.max" class="text-error">{{ item.count.toFixed(0) }}</span>
						<span v-else-if="item.count > 0" class="text-white">{{ item.count.toFixed(0) }}</span>
						<span v-else-if="item.count < 0" class="text-error">{{ item.count.toFixed(0) }}</span>
					</UBadge>

					<UBadge v-if="gameStore.itemProductionRates[item.id] != 0" size="xs" color="neutral" variant="subtle"
						class="absolute -bottom-0.5 -right-0.5 z-10">
						<span v-if="gameStore.itemProductionRates[item.id] > 0" class="text-success">+{{ gameStore.itemProductionRates[item.id].toFixed(1) }} /s</span>
						<span v-else-if="gameStore.itemProductionRates[item.id] < 0" class="text-error">{{ gameStore.itemProductionRates[item.id].toFixed(1) }} /s</span>
					</UBadge>

				</UButton>
			</UTooltip>
		</div>

	</section>

	<!-- Item Modal -->
	<UModal scrollable v-model:open="isItemModalOpen" :ui="{ header: 'p-4 sm:p-4' }">

		<!-- Modal Header -->
		<template #header>

			<div class="flex items-center gap-2">
				<img :src="gameStore.itemImgs[selectedItem.id]" :alt="$t(`items.${selectedItem.id}`)" class="size-7 object-contain" />
				<h3 class="text-lg font-bold text-white">{{ $t(`items.${selectedItem.id}`) }}</h3>
			</div>

			<UButton color="neutral" variant="ghost" icon="i-lucide-x"
				@click="isItemModalOpen = false" />

		</template>

		<!-- Modal Body -->
		<template #body>

			<div class="grid grid-cols-2 gap-1">

				<!-- Item Count -->
				<div class="flex flex-col space-y-2">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.count') }}</h4>

					<div class="rounded-md bg-neutral-800 p-2">

						<span v-if="selectedItem.count >= selectedItem.max" class="text-error">{{ selectedItem.count.toFixed(0) }}</span>
						<span v-else-if="selectedItem.count > 0" class="text-white">{{ selectedItem.count.toFixed(0) }}</span>
						<span v-else-if="selectedItem.count < 0" class="text-error">{{ selectedItem.count.toFixed(0) }}</span>
						<span v-else class="text-muted">{{ selectedItem.count.toFixed(0) }}</span>

						<span class="text-muted"> / {{ selectedItem.max }}</span>

					</div>

				</div>

				<!-- Item Production Rate -->
				<div class="flex flex-col space-y-2">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.production') }}</h4>

					<div class="rounded-md bg-neutral-800 p-2">
						<span v-if="gameStore.itemProductionRates[selectedItem.id] > 0" class="text-success">+{{ gameStore.itemProductionRates[selectedItem.id].toFixed(1) }} /s</span>
						<span v-else-if="gameStore.itemProductionRates[selectedItem.id] < 0" class="text-error">{{ gameStore.itemProductionRates[selectedItem.id].toFixed(1) }} /s</span>
						<span v-else class="text-muted">{{ gameStore.itemProductionRates[selectedItem.id].toFixed(1) }} /s</span>						
					</div>

				</div>

			</div>

			<!-- Item Storages -->
			<div v-if="selectedItem.storages.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.storages') }}</h4>

				<div class="flex flex-col gap-1">
					<div v-for="storage in selectedItem.storages" :key="storage.id"
						class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 p-2">

						<div class="flex min-w-0 items-center gap-2">
							<img :src="gameStore.itemImgs[storage.storerId]" :alt="$t(`items.${storage.storerId}`)" class="size-5 shrink-0 object-contain" />
							<span class="truncate text-xs text-muted">{{ $t(`items.${storage.storerId}`) }}</span>
							<UBadge v-if="gameStore.itemAvailableCounts[storage.storerId] > 0" variant="subtle" color="success" size="sm">{{ gameStore.itemAvailableCounts[storage.storerId] }}</UBadge>
						</div>								

						<div class="flex shrink-0 items-center gap-6">

							<span v-if="storage.assignedCount > 0" class="text-xs font-semibold text-success">+{{ storage.capacity * storage.assignedCount }}</span>

							<div class="flex items-center gap-2">

								<UButton :color="storage.assignedCount > 0 ? 'error' : 'neutral'" variant="subtle" icon="i-lucide-minus" size="xs"
									:disabled="storage.assignedCount <= 0"
									@click="gameStore.unassignStorageStorer(storage, 1)" />

								<span v-if="storage.assignedCount > 0" class="min-w-10 text-center text-xs">{{ storage.assignedCount }}</span>
								<span v-else class="min-w-10 text-center text-xs text-muted">{{ storage.assignedCount }}</span>

								<UButton :color="gameStore.itemAvailableCounts[storage.storerId] > 0 ? 'primary' : 'neutral'" variant="subtle" icon="i-lucide-plus" size="xs"
									:disabled="gameStore.itemAvailableCounts[storage.storerId] <= 0"
									@click="gameStore.assignStorageStorer(storage, 1)" />

							</div>
								
						</div>

					</div>
				</div>

			</div>

			<!-- Item In-Links -->
			<div v-if="selectedItem.inLinks.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.inputs') }}</h4>

				<div class="flex items-center gap-4">
					<UTooltip v-for="link in selectedItem.inLinks" :key="link.id" :text="$t('items.' + link.sourceId)">
						<div class="relative rounded-md bg-neutral-800 p-2 flex items-center gap-4">

							<img :src="gameStore.itemImgs[link.sourceId]" :alt="$t('items.' + link.sourceId)" class="size-5 object-contain" />

							<UBadge size="xs" color="neutral" variant="subtle"
								class="absolute -top-0.5 -right-0.5 z-10">
								<span v-if="link.count > 0">{{ link.count.toFixed(0) }}</span>
								<span v-else-if="link.count === 0" class="text-muted">{{ link.count.toFixed(0) }}</span>
							</UBadge>

						</div>
					</UTooltip>
				</div>

			</div>

			<!-- Item Prods -->
			<div v-if="selectedItem.prods.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.prods') }}</h4>

				<div class="flex flex-col gap-1">
					<div v-for="prod in selectedItem.prods" :key="prod.id"
						class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 p-2">

						<div class="flex min-w-0 items-center gap-2">
							<img :src="gameStore.itemImgs[prod.machineId]" :alt="$t(`items.${prod.machineId}`)" class="size-5 shrink-0 object-contain" />
							<span class="truncate text-xs text-muted">{{ $t(`items.${prod.machineId}`) }}</span>
							<UBadge v-if="gameStore.itemAvailableCounts[prod.machineId] > 0" variant="subtle" color="success" size="sm">{{ gameStore.itemAvailableCounts[prod.machineId] }}</UBadge>
						</div>

						<div class="flex shrink-0 items-center gap-6">

							<span v-if="prod.assignedCount > 0" class="text-xs font-semibold text-success">+{{ prod.assignedCount * prod.outputCount / prod.seconds }}/s</span>

							<div class="flex items-center gap-2">

								<UButton :color="prod.assignedCount > 0 ? 'error' : 'neutral'" variant="subtle" icon="i-lucide-minus" size="xs"
									:disabled="prod.assignedCount <= 0"
									@click="gameStore.unassignProdMachine(prod, 1)" />

								<span v-if="prod.assignedCount > 0" class="min-w-10 text-center text-xs">{{ prod.assignedCount }}</span>
								<span v-else class="min-w-10 text-center text-xs text-muted">{{ prod.assignedCount }}</span>

								<UButton :color="gameStore.itemAvailableCounts[prod.machineId] > 0 ? 'primary' : 'neutral'" variant="subtle" icon="i-lucide-plus" size="xs"
									:disabled="gameStore.itemAvailableCounts[prod.machineId] <= 0"
									@click="gameStore.assignProdMachine(prod, 1)" />

							</div>

						</div>

					</div>
				</div>

			</div>

			<!-- Item Out-Links -->
			<div v-if="selectedItem.outLinks.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.links') }}</h4>

				<div class="flex flex-col gap-1">
					<div v-for="link in selectedItem.outLinks" :key="link.id"
						class="flex items-center justify-between gap-4 rounded-md bg-neutral-800 p-2">

						<div class="flex min-w-0 items-center gap-2">
							<img :src="gameStore.itemImgs[link.conveyorId]" :alt="$t(`items.${link.conveyorId}`)" class="size-5 shrink-0 object-contain" />
							<span class="truncate text-xs text-muted">{{ $t(`items.${link.conveyorId}`) }}</span>
							<UBadge v-if="gameStore.itemAvailableCounts[link.conveyorId] > 0" variant="subtle" color="success" size="sm">{{ gameStore.itemAvailableCounts[link.conveyorId] }}</UBadge>
						</div>

						<div class="flex shrink-0 items-center gap-6">

							<div class="flex items-center gap-2">

								<span v-if="link.assignedCount > 0" class="text-xs font-semibold text-error">-{{ link.assignedCount * link.conveyorSpeed }} /s</span>

								<UIcon name="i-lucide-move-right" size="xs" class="text-muted" />

								<UTooltip :text="$t(`items.${link.targetId}`)">
									<img :src="gameStore.itemImgs[link.targetId]" :alt="$t(`items.${link.targetId}`)" class="size-5 shrink-0 object-contain" />
								</UTooltip>

							</div>

							<div class="flex items-center gap-2">

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
				</div>

			</div>

			<!-- Item Manuals -->
			<div v-if="selectedItem.manuals.length > 0" class="flex flex-col space-y-2">

				<div class="flex items-center gap-2">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.manuals') }}</h4>

					<UFieldGroup size="xs">
						<UButton v-for="count in selectedItem.manualCounts"
							:variant="selectedItem.manualSelectedCount == count ? 'solid' : 'soft'"
							:color="selectedItem.manualSelectedCount == count ? 'primary' : 'neutral'"
							@click="selectedItem.manualSelectedCount = count">
							<span class="text-xs">+{{ count }}</span>
						</UButton>
					</UFieldGroup>

				</div>

				<div class="flex flex-col gap-1">
					<div v-for="manual in selectedItem.manuals" :key="manual.id" class="rounded-md bg-neutral-800 p-2 flex items-center gap-2">

						<div v-if="manual.inputs && manual.inputs.length > 0" class="flex-1 flex items-center gap-4">
							<UTooltip v-for="input in manual.inputs" :key="input.id" :text="$t('items.' + input.id)">
								<div class="relative p-2">

									<img :src="gameStore.itemImgs[input.id]" :alt="$t('items.' + input.id)" class="size-5 object-contain" />

									<UBadge size="xs" color="neutral" variant="subtle"
										class="absolute -top-0.5 -right-0.5 z-10">
										<span v-if="gameStore.itemCounts[input.id] >= input.count * selectedItem.manualSelectedCount" class="text-success">{{ input.count.toFixed(0) * selectedItem.manualSelectedCount }}</span>
										<span v-else class="text-error">{{ input.count.toFixed(0) * selectedItem.manualSelectedCount }}</span>
									</UBadge>

								</div>								
							</UTooltip>
						</div>
						<div v-else class="flex-1">
							<span class="text-muted text-xs italic">{{ $t('modalItem.noManualInputs') }}</span>
						</div>

						<div class="w-24 flex flex-col items-end gap-1">
							<span v-if="manual.isProcessing" class="text-end text-xs text-primary">{{ formatTime(manual.remainingSeconds) }}</span>
							<span v-else class="text-end text-xs text-muted">{{ formatTime(manual.seconds * selectedItem.manualSelectedCount) }}</span>
							<UProgress :model-value="getManualProgress(manual)" size="sm" color="primary" class="flex-1" />
						</div>
						
						<UButton v-if="manual.isProcessing" color="error" variant="subtle" icon="i-lucide-square" size="sm"
							@click="gameStore.cancelManual(manual)" />
						
						<UButton v-else-if="gameStore.canStartManual(manual, selectedItem.manualSelectedCount)" color="primary" variant="subtle" icon="i-lucide-play" size="sm"
							@click="gameStore.startManual(manual, selectedItem.manualSelectedCount)" />

						<UButton v-else color="neutral" variant="subtle" icon="i-lucide-play" disabled  size="sm" />

					</div>
				</div>

			</div>

		</template>

	</UModal>

</template>
