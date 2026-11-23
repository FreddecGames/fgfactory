<script setup lang="ts">

	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

</script>

<template>

	<UModal scrollable :ui="{ content: 'w-[calc(100vw-1.5rem)] min-w-0', body: 'min-w-0' }">

		<!-- Modal Header -->
		<template #header>

			<div class="flex items-center gap-2">
				<img :src="gameStore.itemImgs[gameStore.selectedItem.id]" :alt="$t(`items.${gameStore.selectedItem.id}`)" class="size-6 object-contain" />
				<h3 class="text-lg font-bold text-white">{{ $t(`items.${gameStore.selectedItem.id}`) }}</h3>
			</div>

			<UButton color="neutral" variant="ghost" icon="i-lucide-x"
				@click="gameStore.isItemModalOpen = false" />

		</template>

		<!-- Modal Body -->
		<template #body>

			<div class="grid grid-cols-2 gap-1">

				<!-- Item Count -->
				<div class="flex flex-col space-y-1">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.count') }}</h4>

					<div class="rounded-md bg-neutral-800 ps-2 pe-1 py-1">

						<span v-if="gameStore.selectedItem.count.toFixed(0) >= gameStore.selectedItem.max" class="text-error">{{ gameStore.selectedItem.count.toFixed(0) }}</span>
						<span v-else-if="gameStore.selectedItem.count > 0" class="text-white">{{ gameStore.selectedItem.count.toFixed(0) }}</span>
						<span v-else-if="gameStore.selectedItem.count < 0" class="text-error">{{ gameStore.selectedItem.count.toFixed(0) }}</span>
						<span v-else class="text-muted">{{ gameStore.selectedItem.count.toFixed(0) }}</span>

						<span class="text-muted"> / {{ gameStore.selectedItem.max }}</span>

					</div>

				</div>

				<!-- Item Production Rate -->
				<div class="flex flex-col space-y-1">

					<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.production') }}</h4>

					<div class="rounded-md bg-neutral-800 ps-2 pe-1 py-1">
						<span v-if="gameStore.itemProds[gameStore.selectedItem.id] > 0" class="text-success">+{{ gameStore.itemProds[gameStore.selectedItem.id].toFixed(1) }} /s</span>
						<span v-else-if="gameStore.itemProds[gameStore.selectedItem.id] < 0" class="text-error">{{ gameStore.itemProds[gameStore.selectedItem.id].toFixed(1) }} /s</span>
						<span v-else class="text-muted">{{ gameStore.itemProds[gameStore.selectedItem.id].toFixed(1) }} /s</span>						
					</div>

				</div>

			</div>

			<!-- Item Prod -->
			<ItemProd v-if="gameStore.selectedItem.prod" />

			<!-- Item Storage -->
			<ItemStorage v-if="gameStore.selectedItem.storage" />

			<!-- Item Manual -->
			<ItemManual v-if="gameStore.selectedItem.manual" />

		</template>

	</UModal>

</template>