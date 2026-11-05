<script setup lang="ts">

	import { computed, ref } from 'vue'
	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

	const groupedMissions = computed(() => {

		return gameStore.items.filter((item: any) => item.type === 'mission').reduce((groups: Record<string, any[]>, item: any) => {
			const group = item.group
			const groupItems = groups[group] || (groups[group] = [])
			groupItems.push(item)
			return groups
		}, {})
	})

	const selectedMission = ref<any | null>(null)
	const isMissionModalOpen = ref(false)

	function openMission(item: any) {

		selectedMission.value = item
		isMissionModalOpen.value = true
	}

	const selectedManuals = computed(() => {

		if (!selectedMission.value) return []

		return gameStore.manuals.filter((manual: any) =>
			manual.output.id === selectedMission.value.id)
	})

	function getManualProgress(manual: any): number {

		const totalDuration = manual.seconds * manual.queueCount
		if (!manual.isProcessing || totalDuration <= 0) return 0

		return Math.min(100, Math.max(0, (manual.progressSeconds / totalDuration) * 100))
	}

</script>

<template>

	<!-- Mission Groups -->
	<section v-for="(missions, group) in groupedMissions" :key="group" class="flex flex-col gap-2">

		<h2 class="text-center text-xs font-semibold text-neutral-400">{{ $t('groups.' + group) }}</h2>

		<div class="flex flex-wrap items-center justify-center gap-2">
			<UTooltip v-for="mission in missions" :key="mission.id" :text="$t(`items.${mission.id}`)">
				<UButton color="neutral" variant="subtle" class="relative aspect-square size-10"
					@click="openMission(mission)">

					<img :src="mission.img" alt="" class="size-full object-contain" />

					<UBadge v-if="mission.count != 0" size="xs" :color="mission.count >= mission.max ? 'success' : 'neutral'" variant="solid"
						class="absolute -top-0.5 -right-0.5 z-10">
						<span v-if="mission.count >= mission.max"><UIcon name="i-lucide-check" /></span>
						<span v-else-if="mission.count > 0">{{ mission.count.toFixed(0) }} / {{ mission.max.toFixed(0) }}</span>
					</UBadge>

				</UButton>
			</UTooltip>
		</div>

	</section>

	<!-- Mission Modal -->
	<UModal scrollable v-model:open="isMissionModalOpen" :ui="{ header: 'p-4 sm:p-4' }">

		<!-- Modal Header -->
		<template #header>

			<div class="flex items-center gap-2">
				<img :src="selectedMission.img" alt="" class="size-7 object-contain" />
				<h3 class="text-lg font-bold text-white">{{ $t('items.' + selectedMission.id) }}</h3>
			</div>

			<UButton color="neutral" variant="ghost" icon="i-lucide-x"
				@click="isMissionModalOpen = false" />

		</template>

		<!-- Modal Body -->
		<template #body>

			<!-- Mission Manuals -->
			<div v-if="selectedManuals.length > 0" class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalMission.manuals') }}</h4>

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
							<span class="text-muted text-xs italic">{{ $t('modalItem.noManualInputs') }}</span>
						</div>

						<div v-if="selectedMission.count >= selectedMission.max">
							<UButton color="success" variant="subtle" icon="i-lucide-check" disabled  size="sm">
								{{ $t('modalMission.completed') }}
							</UButton>
						</div>
						<div v-else-if="manual.seconds > 0" class="flex items-center gap-2">

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
						<div v-else class="flex items-center gap-2">

							<UButton v-if="gameStore.canStartManual(manual, 1)" color="primary" variant="subtle" icon="i-lucide-check" size="sm"
								@click="gameStore.startManual(manual, 1)">
								{{ $t('modalMission.complete') }}
							</UButton>

							<UButton v-else color="neutral" variant="subtle" icon="i-lucide-check" disabled  size="sm">
								{{ $t('modalMission.complete') }}
							</UButton>

						</div>

					</div>
				</div>

			</div>

		</template>

	</UModal>

</template>
