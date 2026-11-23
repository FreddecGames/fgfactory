<script setup lang="ts">

	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

</script>

<template>

	<UModal scrollable :ui="{ content: 'w-[calc(100vw-1.5rem)] min-w-0', body: 'min-w-0' }">

		<!-- Modal Header -->
		<template #header>

			<div class="flex items-center gap-2">
				<img :src="gameStore.itemImgs[gameStore.selectedMission.id]" :alt="$t('items.' + gameStore.selectedMission.id)" class="size-7 object-contain" />
				<h3 class="text-lg font-bold text-white">{{ $t('items.' + gameStore.selectedMission.id) }}</h3>
			</div>

			<UButton color="neutral" variant="ghost" icon="i-lucide-x"
				@click="gameStore.isMissionModalOpen = false" />

		</template>

		<!-- Modal Body -->
		<template #body>

			<!-- Mission Description -->
			<div class="rounded-md bg-neutral-800 p-2 text-center">
				<span class="text-xs">{{ $t('desc.' + gameStore.selectedMission.id) }}</span>
			</div>

			<!-- Mission Manuals -->
			<div v-if="gameStore.selectedMission.manual" class="flex flex-col space-y-1">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalMission.manuals') }}</h4>

				<div v-if="gameStore.selectedMission.manual.inputs && gameStore.selectedMission.manual.inputs.length > 0" class="flex flex-col gap-1">
					<div v-for="input in gameStore.selectedMission.manual.inputs" :key="input.id"
						class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 px-2 py-1.5">

							<UButton color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
								:avatar="{ src:gameStore.itemImgs[input.id] }"
								:label="$t(`items.${input.id}`)"
								@click="gameStore.openItem(input.id)" />
							
							<span v-if="gameStore.itemCounts[input.id] >= input.count * gameStore.selectedMission.manualSelectedCount" class="text-success text-xs">{{ gameStore.itemCounts[input.id] }} / {{ input.count.toFixed(0) * gameStore.selectedMission.manualSelectedCount }}</span>
							<span v-else class="text-error text-xs">{{ gameStore.itemCounts[input.id] }} / {{ input.count.toFixed(0) * gameStore.selectedMission.manualSelectedCount }}</span>

					</div>
				</div>
				<div v-else class="flex-1">
					<span class="text-muted text-xs italic">{{ $t('modalItem.noInputs') }}</span>
				</div>

				<div class="mt-3 flex justify-end">

					<UButton v-if="gameStore.selectedMission.count > 0" color="success" variant="subtle" icon="i-lucide-award" disabled size="sm"
						:label="$t('modalMission.completed')" />

					<UButton v-else-if="gameStore.canStartManual(gameStore.selectedMission.manual, gameStore.selectedMission.manualSelectedCount) === 0" color="primary" variant="subtle" icon="i-lucide-award" size="sm"
						:label="$t('modalMission.complete')"
						@click="gameStore.startManual(gameStore.selectedMission.manual, gameStore.selectedMission.manualSelectedCount); gameStore.isMissionModalOpen = false;" />

					<UButton v-else color="neutral" variant="subtle" icon="i-lucide-award" disabled size="sm"
						:label="$t('modalMission.complete')" />

				</div>

			</div>

		</template>

	</UModal>

</template>
