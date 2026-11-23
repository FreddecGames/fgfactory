<script setup lang="ts">

	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

</script>

<template>

	<UModal scrollable :ui="{ content: 'w-[calc(100vw-1.5rem)] min-w-0', body: 'min-w-0' }">
		
		<!-- Modal Header -->
		<template #header>

			<div class="flex items-center gap-2">
				<UIcon name="i-lucide-lock" class="text-muted" />
				<h3 class="text-lg font-bold text-muted">{{ $t(`items.${gameStore.selectedLocked.id}`) }}</h3>
			</div>

			<UButton color="neutral" variant="ghost" icon="i-lucide-x"
				@click="gameStore.isLockedModalOpen = false" />

		</template>

		<!-- Modal Body -->
		<template #body>
			<div class="flex flex-col space-y-1">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('modalLocked.requirements') }}</h4>

				<div v-for="(count, req) of gameStore.selectedLocked.requirement" :key="req"
					class="flex items-center justify-between gap-3 rounded-md bg-neutral-800 px-2 py-1.5">

						<UButton v-if="gameStore.itemUnlockeds[req]" color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
							:avatar="{ src:gameStore.itemImgs[req] }"
							:label="$t(`items.${req}`)"
							@click="gameStore.openMission(req)" />

						<UButton v-else color="neutral" variant="link" size="xs" class="truncate p-0 gap-2"
							icon="i-lucide-lock"
							:label="$t(`items.${req}`)"
							@click="gameStore.openMission(req)" />

				</div>

			</div>
		</template>

	</UModal>

</template>