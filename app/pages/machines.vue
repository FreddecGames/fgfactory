<script setup lang="ts">

	import { computed, ref } from 'vue'
	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

	const groupedMachines = computed(() => {

		return gameStore.items.filter((item: any) => item.type === 'machine' || item.type === 'storer' || item.type === 'conveyor').reduce((groups: Record<string, any[]>, item: any) => {
			const group = item.group
			const groupMachines = groups[group] || (groups[group] = [])
			groupMachines.push(item)
			return groups
		}, {})
	})

	const selectedMachine = ref<any | null>(null)
	const isMachineModalOpen = ref(false)

	function openMachine(item: any) {

		selectedMachine.value = item
		isMachineModalOpen.value = true
	}

	const selectedManuals = computed(() => {

		if (!selectedMachine.value) return []

		return gameStore.manuals.filter((manual: any) =>
			manual.output.id === selectedMachine.value.id)
	})

	function getManualProgress(manual: any): number {

		const totalDuration = manual.seconds * manual.processCount
		if (!manual.isProcessing || totalDuration <= 0) return 0

		return Math.min(100, Math.max(0, (manual.remainingSeconds / totalDuration) * 100))
	}

</script>

<template>

	<!-- Machine Groups -->
	<section v-for="(machines, group) in groupedMachines" :key="group" class="flex flex-col gap-2">

		<h2 class="text-center text-xs font-semibold text-neutral-400">{{ $t('groups.' + group) }}</h2>

		<div class="flex flex-wrap items-center justify-center gap-2">
			<UTooltip v-for="machine in machines" :key="machine.id" :text="$t(`items.${machine.id}`)">
				<UButton color="neutral" variant="subtle" class="relative aspect-square size-10"
					@click="openMachine(machine)">

					<img :src="machine.img" alt="" class="size-full object-contain" />

					<UBadge v-if="machine.count != 0" size="xs" color="neutral" variant="subtle"
						class="absolute -top-0.5 -right-0.5 z-10">
						<span v-if="machine.count > 0" class="text-white">{{ machine.count.toFixed(0) }}</span>
						<span v-else-if="machine.count < 0" class="text-error">{{ machine.count.toFixed(0) }}</span>
					</UBadge>

					<UBadge v-if="gameStore.itemAvailableCounts[machine.id] > 0" size="xs" color="neutral" variant="subtle"
						class="absolute -bottom-0.5 -right-0.5 z-10">
						<span class="text-success">{{ gameStore.itemAvailableCounts[machine.id] }}</span>
					</UBadge>

				</UButton>
			</UTooltip>
		</div>

	</section>

	<!-- Machine Modal -->
	<UModal scrollable v-model:open="isMachineModalOpen" :ui="{ header: 'p-4 sm:p-4' }">

		<!-- Modal Header -->
		<template #header>

			<div class="flex items-center gap-2">
				<img :src="selectedMachine.img" alt="" class="size-7 object-contain" />
				<h3 class="text-lg font-bold text-white">{{ $t('items.' + selectedMachine.id) }}</h3>
			</div>

			<UButton color="neutral" variant="ghost" icon="i-lucide-x"
				@click="isMachineModalOpen = false" />

		</template>

		<!-- Modal Body -->
		<template #body>

			<div class="grid grid-cols-2 gap-1">

				<!-- Machine Count -->
				<div class="flex flex-col space-y-2">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalMachine.count') }}</h4>

					<div class="rounded-md bg-neutral-800 p-2">
						<span v-if="selectedMachine.count > 0" class="text-white">{{ selectedMachine.count.toFixed(0) }}</span>
						<span v-else-if="selectedMachine.count < 0" class="text-error">{{ selectedMachine.count.toFixed(0) }}</span>
						<span v-else class="text-muted">{{ selectedMachine.count.toFixed(0) }}</span>
					</div>

				</div>

				<!-- Machine Available Count -->
				<div class="flex flex-col space-y-2">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalMachine.available') }}</h4>

					<div class="rounded-md bg-neutral-800 p-2">
						<span v-if="gameStore.itemAvailableCounts[selectedMachine.id] > 0" class="text-success">{{ gameStore.itemAvailableCounts[selectedMachine.id].toFixed(0) }}</span>
						<span v-else class="text-muted">{{ gameStore.itemAvailableCounts[selectedMachine.id].toFixed(0) }}</span>
					</div>

				</div>

			</div>

			<!-- Machine Manuals -->
			<div v-if="selectedManuals.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalMachine.manuals') }}</h4>

				<div class="flex flex-col gap-1">
					<div v-for="manual in selectedManuals" :key="manual.id" class="rounded-md bg-neutral-800 p-2 flex items-center gap-2">

						<div v-if="manual.inputs && manual.inputs.length > 0" class="flex-1 flex items-center gap-4">
							<UTooltip v-for="input in manual.inputs" :key="input.id" :text="$t('items.' + input.id)">
								<div class="relative p-2">

									<img :src="input.img" :alt="$t('items.' + input.id)" class="size-5 object-contain" />

									<UBadge size="xs" color="neutral" variant="subtle"
										class="absolute -top-0.5 -right-0.5 z-10">
										<span v-if="gameStore.itemCounts[input.id] >= input.count" class="text-success">{{ input.count.toFixed(0) }}</span>
										<span v-else class="text-error">{{ input.count.toFixed(0) }}</span>
									</UBadge>

								</div>								
							</UTooltip>
						</div>
						<div v-else class="flex-1">
							<span class="text-muted text-xs italic">{{ $t('modalMachine.noManualInputs') }}</span>
						</div>

						<div class="w-24 flex flex-col items-end gap-1">
							<span v-if="manual.isProcessing" class="text-end text-xs text-primary">{{ formatTime(manual.remainingSeconds) }}</span>
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