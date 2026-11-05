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

	const selectedStorages = computed(() => {

		if (!selectedItem.value) return []

		return gameStore.storages
			.filter((storage: any) => storage.itemId === selectedItem.value.id)
			.map((storage: any) => ({
				storage,
				storer: gameStore.items.find((candidate: any) => candidate.id === storage.storerId),
			}))
			.filter((entry: any) => entry.storer)
	})

	const selectedProds = computed(() => {

		if (!selectedItem.value) return []

		return gameStore.prods.flatMap((production: any) => {

			const output = production.outputs.find((candidate: any) => candidate.id === selectedItem.value.id)
			if (!output) return []

			const machine = gameStore.items.find((candidate: any) => candidate.id === production.machineId)
			if (!machine) return []

			const outputRate = production.seconds > 0
				? output.count * production.assignedCount / production.seconds
				: 0

			return [{
				prod: { ...production, outputRate },
				machine,
			}]
		})
	})

	const selectedLinks = computed(() => {

		if (!selectedItem.value) return []

		return gameStore.links
			.filter((link: any) => link.sourceItemId === selectedItem.value.id)
			.flatMap((link: any) => {

				const conveyor = gameStore.items.find((candidate: any) => candidate.id === link.conveyorId)
				const outputItem = gameStore.itemMap[link.targetItemId]

				return {
					link,
					conveyor: conveyor
						? {
							...conveyor,
							prodOutputImg: outputItem?.img,
							prodOutputName: outputItem?.id,
						}
						: undefined,
				}
			})
			.filter((entry: any) => entry.conveyor)
	})

	const selectedManuals = computed(() => {

		if (!selectedItem.value) return []

		return gameStore.manuals.filter((manual: any) =>
			manual.output.id === selectedItem.value.id)
	})

	function getManualProgress(manual: any): number {

		const totalDuration = manual.seconds * manual.queueCount
		if (!manual.isProcessing || totalDuration <= 0) return 0

		return Math.min(100, Math.max(0, (manual.progressSeconds / totalDuration) * 100))
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

					<img :src="item.img" alt="" class="size-full object-contain" />

					<UBadge v-if="item.count > 0" size="xs" color="neutral" variant="subtle"
						class="absolute -top-0.5 -right-0.5 z-10">
						<span class="text-success">{{ item.count.toFixed(0) }}</span>
					</UBadge>
					<UBadge v-else-if="item.count < 0" size="xs" color="neutral" variant="subtle"
						class="absolute -top-0.5 -right-0.5 z-10">
						<span class="text-error">{{ item.count.toFixed(0) }}</span>
					</UBadge>

					<UBadge v-if="gameStore.getItemProductionRate(item.id) > 0" size="xs" color="neutral" variant="subtle"
						class="absolute -bottom-0.5 -right-0.5 z-10">
						<span class="text-success">+{{ gameStore.getItemProductionRate(item.id).toFixed(1) }} /s</span>
					</UBadge>
					<UBadge v-else-if="gameStore.getItemProductionRate(item.id) < 0" size="xs" color="neutral" variant="subtle"
						class="absolute -bottom-0.5 -right-0.5 z-10">
						<span class="text-error">{{ gameStore.getItemProductionRate(item.id).toFixed(1) }} /s</span>
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
				<img :src="selectedItem.img" alt="" class="size-7 object-contain" />
				<h3 class="text-lg font-bold text-white">{{ $t('items.' + selectedItem.id) }}</h3>
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
						<span>{{ selectedItem.count.toFixed(0) }} / {{ selectedItem.max }}</span>
					</div>

				</div>

				<!-- Item Production Rate -->
				<div class="flex flex-col space-y-2">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.production') }}</h4>

					<div class="rounded-md bg-neutral-800 p-2">
						<span :class="{ 'text-success': gameStore.getItemProductionRate(selectedItem.id) > 0, 'text-error': gameStore.getItemProductionRate(selectedItem.id) < 0 }">
							<span v-if="gameStore.getItemProductionRate(selectedItem.id) > 0">+</span>{{ gameStore.getItemProductionRate(selectedItem.id).toFixed(1) }} /s
						</span>
					</div>

				</div>

			</div>

			<!-- Item Storages -->
			<div v-if="selectedStorages.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.storages') }}</h4>

				<div class="flex flex-col gap-1">
					<div v-for="{ storage, storer } in selectedStorages" :key="storage.id"
						class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 p-2">

						<div class="flex min-w-0 items-center gap-2">
							<img :src="storer.img" :alt="$t(`items.${storer.id}`)" class="size-5 shrink-0 object-contain" />
							<span class="truncate text-xs">{{ $t(`items.${storer.id}`) }}</span>
						</div>								

						<div class="flex shrink-0 items-center gap-2">

							<span class="text-xs font-semibold text-success">+{{ storage.capacity }}</span>								

							<UButton color="error" variant="subtle" icon="i-lucide-minus" size="xs"
								:aria-label="$t('modalItem.unassignStorer')"
								:disabled="storage.assignedCount <= 0"
								@click="gameStore.unassignStorageStorer(storage)" />

							<span class="min-w-10 text-center text-xs">{{ storage.assignedCount }}</span>

							<UButton color="primary" variant="subtle" icon="i-lucide-plus" size="xs"
								:aria-label="$t('modalItem.assignStorer')"
								:disabled="gameStore.getAvailableStorerCount(storer.id) <= 0"
								@click="gameStore.assignStorageStorer(storage)" />
								
						</div>

					</div>
				</div>
			</div>

			<!-- Item Inputs -->
			<div v-if="selectedItem.inputs.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.inputs') }}</h4>

				<div class="flex items-center gap-4">
					<UTooltip v-for="input in selectedItem.inputs" :key="input.id" :text="$t('items.' + input.id)">
						<div class="relative rounded-md bg-neutral-800 p-2 flex items-center gap-4">

							<img :src="input.img" :alt="$t('items.' + input.id)" class="size-5 object-contain" />

							<UBadge size="xs" color="neutral" variant="subtle"
								class="absolute -top-0.5 -right-0.5 z-10">
								<span>{{ input.count.toFixed(0) }}</span>
							</UBadge>

						</div>
					</UTooltip>
				</div>

			</div>

			<!-- Item Prods -->
			<div v-if="selectedProds.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.prods') }}</h4>

				<div class="flex flex-col gap-1">
					<div v-for="{ prod, machine } in selectedProds" :key="prod.id"
						class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 p-2">

						<div class="flex min-w-0 items-center gap-2">
							<img :src="machine.img" :alt="$t(`items.${machine.id}`)" class="size-5 shrink-0 object-contain" />
							<span class="truncate text-xs">{{ $t(`items.${machine.id}`) }}</span>
						</div>

						<div class="flex shrink-0 items-center gap-2">

							<div class="flex items-center gap-1">
								<span class="text-xs font-semibold text-success">+{{ prod.outputRate }}/s</span>
							</div>

							<UButton color="error" variant="subtle" icon="i-lucide-minus" size="xs"
								:aria-label="$t('modalItem.unassignConveyor')"
								:disabled="prod.assignedCount <= 0"
								@click="gameStore.unassignProdMachine(prod, machine)" />

							<span class="min-w-10 text-center text-xs">{{ prod.assignedCount }}</span>

							<UButton color="primary" variant="subtle" icon="i-lucide-plus" size="xs"
								:aria-label="$t('modalItem.assignConveyor')"
								:disabled="gameStore.getAvailableMachineCount(machine.id) <= 0"
								@click="gameStore.assignProdMachine(prod, machine)" />

						</div>

					</div>
				</div>

			</div>

			<!-- Item Links -->
			<div v-if="selectedLinks.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.links') }}</h4>

				<div class="flex flex-col gap-1">
					<div v-for="{ link, conveyor } in selectedLinks" :key="`${link.targetItemId}_${conveyor.id}`"
						class="flex items-center justify-between gap-4 rounded-md bg-neutral-800 p-2">

						<div class="flex min-w-0 items-center gap-2">
							<img :src="conveyor.img" :alt="$t(`items.${conveyor.id}`)" class="size-5 shrink-0 object-contain" />
							<span class="truncate text-xs">{{ $t(`items.${conveyor.id}`) }}</span>
						</div>

						<div class="flex shrink-0 items-center gap-2">

							<div class="flex items-center gap-2">
								<span class="text-xs font-semibold text-error">-{{ link.rate }}/s</span>
								<UIcon name="i-lucide-move-right" size="xs" class="text-muted" />
								<UTooltip :text="$t(`items.${conveyor.prodOutputName}`)">
									<img :src="conveyor.prodOutputImg" :alt="$t(`items.${conveyor.prodOutputName}`)" class="size-5 shrink-0 object-contain" />
								</UTooltip>
							</div>

							<UButton color="error" variant="subtle" icon="i-lucide-minus" size="xs"
								:aria-label="$t('modalItem.unassignConveyor')"
								:disabled="link.assignedCount <= 0"
								@click="gameStore.unassignLinkConveyor(link)" />

							<span class="min-w-10 text-center text-xs">{{ link.assignedCount }}</span>

							<UButton color="primary" variant="subtle" icon="i-lucide-plus" size="xs"
								:aria-label="$t('modalItem.assignConveyor')"
								:disabled="gameStore.getAvailableConveyorCount(conveyor.id) <= 0"
								@click="gameStore.assignLinkConveyor(link)" />

						</div>

					</div>
				</div>

			</div>

			<!-- Item Manuals -->
			<div v-if="selectedManuals.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.manuals') }}</h4>

				<div class="flex flex-col gap-1">
					<div v-for="manual in selectedManuals" :key="manual.id" class="rounded-md bg-neutral-800 p-2 flex items-center gap-2">

						<div class="flex-1 flex items-center gap-4">
							<UTooltip v-for="input in manual.inputs" :key="input.id" :text="$t('items.' + input.id)">
								<div class="relative rounded-md bg-neutral-800 p-2 flex items-center gap-4">

									<img :src="input.img" :alt="$t('items.' + input.id)" class="size-5 object-contain" />

									<UBadge size="xs" color="neutral" variant="subtle"
										class="absolute -bottom-0.5 -right-0.5 z-10">
										<span>{{ input.count.toFixed(0) }}</span>
									</UBadge>

								</div>								
							</UTooltip>
						</div>

						<div class="w-24 flex flex-col items-end gap-1">
							<span v-if="manual.isProcessing" class="text-end text-xs text-primary">{{ formatTime(manual.progressSeconds) }}</span>
							<span v-else class="text-end text-xs text-muted">{{ formatTime(manual.seconds) }}</span>
							<UProgress :model-value="getManualProgress(manual)" size="sm" color="primary" class="flex-1" />
						</div>
						
						<UButton v-if="manual.isProcessing" color="error" variant="subtle" icon="i-lucide-square" size="sm"
							@click="gameStore.cancelManual(manual)" />
						
						<UButton v-else-if="gameStore.canStartManual(manual, 1)" color="primary" variant="subtle" icon="i-lucide-play" size="sm"
							@click="gameStore.startManual(manual, 1)" />

						<UButton v-else color="neutral" variant="subtle" icon="i-lucide-play" disabled  size="sm" />

					</div>
				</div>

			</div>

		</template>

	</UModal>

</template>
