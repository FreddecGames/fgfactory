<script setup lang="ts">

	import { computed, ref } from 'vue'
	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

	const groupedItems = computed(() => {

		return gameStore.items.reduce((groups: Record<string, any[]>, item: any) => {
			const group = item.group || 'other'
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

	const selectedManuals = computed(() => {

		if (!selectedItem.value) return []

		return gameStore.manuals.filter((manual: any) =>
			manual.outputs.some((output: any) => output.id === selectedItem.value.id)
		)
	})

	const selectedStorages = computed(() => {

		if (!selectedItem.value) return []

		return gameStore.storages
			.filter((storage: any) => storage.itemId === selectedItem.value.id)
			.map((storage: any) => ({
				storage,
				storer: gameStore.storers.find((candidate: any) => candidate.id === storage.storerId),
			}))
			.filter((entry: any) => entry.storer)
	})

	const selectedLinks = computed(() => {

		if (!selectedItem.value) return []

		return gameStore.links
			.filter((link: any) => link.sourceItemId === selectedItem.value.id)
			.map((link: any) => ({
				link,
				production: gameStore.prodMap[link.targetProdId],
				conveyors: link.conveyorAssignments
					.map((assignment: any) => ({
						assignment,
						conveyor: gameStore.conveyors.find((candidate: any) => candidate.id === assignment.conveyorId),
					}))
					.filter((entry: any) => entry.conveyor),
			}))
			.filter((entry: any) => entry.production)
	})

	function getManualProgress(manual: any): number {

		const totalDuration = manual.durationSeconds * manual.queueCount
		if (!manual.isProcessing || totalDuration <= 0) return 0

		return Math.min(100, Math.max(0, (manual.progressSeconds / totalDuration) * 100))
	}

</script>

<template>

	<section v-for="(items, group) in groupedItems" :key="group" class="flex flex-col gap-3">

		<h2 class="text-center text-xs font-semibold text-neutral-400">{{ $t('groups.' + group) }}</h2>

		<div class="flex items-center justify-center gap-3">
			<UButton v-for="item in items" :key="item.id"
				color="neutral" variant="subtle" class="aspect-square size-10"
				@click="openItem(item)">
				<img :src="item.img" alt="" class="size-full object-contain" />
			</UButton>
		</div>

	</section>

	<UModal v-model:open="isItemModalOpen">
		<template #content>
			<UCard v-if="selectedItem">

				<template #header>
					<div class="flex items-center justify-between">

						<div class="flex items-center gap-3">
							<img :src="selectedItem.img" alt="" class="size-5 object-contain" />
							<h3 class="text-lg font-bold text-white">{{ $t('items.' + selectedItem.id) }}</h3>
						</div>

						<UButton color="neutral" variant="ghost" icon="i-lucide-x"
							@click="isItemModalOpen = false" />

					</div>
				</template>

				<div class="flex flex-col space-y-6">

					<div class="grid grid-cols-2 gap-3">

						<div class="flex flex-col space-y-3">

							<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.count') }}</h4>

							<UCard variant="subtle" :ui="{ 'body': 'sm:p-3 p-3' }">
								<span class="font-semibold">{{ selectedItem.count.toFixed(0) }} / {{ selectedItem.max }}</span>
							</UCard>

						</div>

					</div>

					<div class="flex flex-col space-y-3">

						<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.manuals') }}</h4>

						<div v-if="selectedManuals.length > 0" class="flex flex-col gap-1">
							<UFieldGroup v-for="manual in selectedManuals" :key="manual.id" class="w-full" size="md">

								<UPopover :content="{ align: 'start' }">

									<UButton color="neutral" variant="subtle" icon="i-lucide-info" />

									<template #content>
										<UCard :ui="{ 'body': 'p-3 sm:p-3' }">

										</UCard>
									</template>

								</UPopover>

								<UBadge color="neutral" variant="subtle" class="w-full">
									<div class="flex-auto flex items-center gap-2">
										<UProgress :model-value="getManualProgress(manual)" size="sm" color="primary" class="flex-1" />
										<span v-if="manual.isProcessing" class="text-end text-xs text-white">{{ formatTime(manual.progressSeconds) }}</span>
										<span v-else class="text-end text-xs text-white">{{ formatTime(manual.durationSeconds) }}</span>
									</div>
								</UBadge>
								
								<UButton v-if="manual.isProcessing" color="error" variant="subtle" icon="i-lucide-square"
									@click="gameStore.cancelManual(manual)" />
								
								<UButton v-else color="primary" variant="subtle" icon="i-lucide-play"
									:disabled="!gameStore.canStartManual(manual, 1)"
									@click="gameStore.startManual(manual, 1)" />

							</UFieldGroup>
						</div>

					</div>

					<div class="flex flex-col space-y-3">

						<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.storages') }}</h4>

						<div v-if="selectedStorages.length > 0" class="flex flex-col gap-2">
							<div v-for="{ storage, storer } in selectedStorages" :key="storage.id"
								class="flex items-center justify-between gap-3 rounded-md bg-neutral-800/60 p-2">
								<div class="flex min-w-0 items-center gap-2">
									<img :src="storer.img" :alt="$t(`items.${storer.id}`)" class="size-6 shrink-0 object-contain" />
									<span class="truncate text-sm">{{ $t(`items.${storer.id}`) }}</span>
								</div>
								
								<div class="flex shrink-0 items-center gap-2">
									<UButton color="neutral" variant="subtle" icon="i-lucide-minus" size="xs"
										:aria-label="$t('modalItem.unassignStorer')"
										:disabled="storage.assignedCount <= 0"
										@click="gameStore.unassignStorageStorer(storage)" />
									<span class="min-w-10 text-center text-xs">{{ storage.assignedCount }} / {{ storer.count }}</span>
									<UButton color="neutral" variant="subtle" icon="i-lucide-plus" size="xs"
										:aria-label="$t('modalItem.assignStorer')"
										:disabled="gameStore.getAvailableStorerCount(storer.id) <= 0"
										@click="gameStore.assignStorageStorer(storage)" />
								</div>
							</div>
						</div>
						<p v-else class="text-sm text-neutral-500">{{ $t('modalItem.noStorages') }}</p>
					</div>

					<div class="flex flex-col space-y-3">

						<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.links') }}</h4>

						<div v-if="selectedLinks.length > 0" class="flex flex-col gap-2">
							<UCard v-for="{ link, production, conveyors } in selectedLinks" :key="link.targetProdId"
								variant="subtle" :ui="{ body: 'p-3 sm:p-3' }">
								<div class="mb-3 flex items-center justify-between gap-3">
									<div class="flex min-w-0 items-center gap-2">
										<img :src="gameStore.machines.find((machine: any) => machine.id === production.machineId)?.img"
											:alt="$t(`items.${production.machineId}`)" class="size-6 shrink-0 object-contain" />
										<span class="truncate text-sm">{{ $t(`items.${production.machineId}`) }}</span>
									</div>
									<span class="shrink-0 text-xs text-neutral-400">{{ link.rate }} /s</span>
								</div>

								<div v-if="conveyors.length > 0" class="flex flex-col gap-2">
									<div v-for="{ assignment, conveyor } in conveyors" :key="conveyor.id"
										class="flex items-center justify-between gap-3">
										<div class="flex min-w-0 items-center gap-2">
											<img :src="conveyor.img" :alt="$t(`items.${conveyor.id}`)" class="size-5 shrink-0 object-contain" />
											<span class="truncate text-xs">{{ $t(`items.${conveyor.id}`) }}</span>
											<span class="shrink-0 text-xs text-neutral-500">({{ conveyor.speed }} /s)</span>
										</div>

										<div class="flex shrink-0 items-center gap-2">
											<UButton color="neutral" variant="subtle" icon="i-lucide-minus" size="xs"
												:aria-label="$t('modalItem.unassignConveyor')"
												:disabled="assignment.assignedCount <= 0"
												@click="gameStore.unassignLinkConveyor(link, assignment)" />
											<span class="min-w-10 text-center text-xs">{{ assignment.assignedCount }} / {{ conveyor.count }}</span>
											<UButton color="neutral" variant="subtle" icon="i-lucide-plus" size="xs"
												:aria-label="$t('modalItem.assignConveyor')"
												:disabled="gameStore.getAvailableConveyorCount(conveyor.id) <= 0"
												@click="gameStore.assignLinkConveyor(link, assignment)" />
										</div>
									</div>
								</div>
								<p v-else class="text-xs text-neutral-500">{{ $t('modalItem.noConveyors') }}</p>
							</UCard>
						</div>
						<p v-else class="text-sm text-neutral-500">{{ $t('modalItem.noLinks') }}</p>
					</div>

				</div>

			</UCard>
		</template>
	</UModal>

</template>
