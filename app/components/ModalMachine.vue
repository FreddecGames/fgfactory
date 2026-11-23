<script setup lang="ts">

	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

</script>

<template>

	<UModal scrollable :ui="{ content: 'w-[calc(100vw-1.5rem)] min-w-0', body: 'min-w-0' }">

		<!-- Modal Header -->
		<template #header>

			<div class="flex items-center gap-2">
				<img :src="gameStore.itemImgs[gameStore.selectedMachine.id]" :alt="$t('items.' + gameStore.selectedMachine.id)" class="size-7 object-contain" />
				<h3 class="text-lg font-bold text-white">{{ $t('items.' + gameStore.selectedMachine.id) }}</h3>
			</div>

			<UButton color="neutral" variant="ghost" icon="i-lucide-x"
				@click="gameStore.isMachineModalOpen = false" />

		</template>

		<!-- Modal Body -->
		<template #body>

			<div class="grid grid-cols-2 gap-1">

				<!-- Machine Count -->
				<div class="flex flex-col space-y-2">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalMachine.count') }}</h4>

					<div class="rounded-md bg-neutral-800 p-2">
						<span v-if="gameStore.selectedMachine.count > 0" class="text-white">{{ gameStore.selectedMachine.count.toFixed(0) }}</span>
						<span v-else-if="gameStore.selectedMachine.count < 0" class="text-error">{{ gameStore.selectedMachine.count.toFixed(0) }}</span>
						<span v-else class="text-muted">{{ gameStore.selectedMachine.count.toFixed(0) }}</span>
					</div>

				</div>

				<!-- Machine Available Count -->
				<div class="flex flex-col space-y-2">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalMachine.available') }}</h4>

					<div class="rounded-md bg-neutral-800 p-2">
						<span v-if="gameStore.itemAvailableCounts[gameStore.selectedMachine.id] > 0" class="text-success">{{ gameStore.itemAvailableCounts[gameStore.selectedMachine.id].toFixed(0) }}</span>
						<span v-else class="text-muted">{{ gameStore.itemAvailableCounts[gameStore.selectedMachine.id].toFixed(0) }}</span>
					</div>

				</div>

			</div>

			<!-- Machine Manual -->
			<ItemManual v-if="gameStore.selectedMachine.manual" :manualId="gameStore.selectedMachine.manual.id" />

		</template>

	</UModal>

</template>