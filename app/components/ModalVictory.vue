<script setup lang="ts">

	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

</script>

<template>

	<UModal scrollable :ui="{ content: 'w-[calc(100vw-1.5rem)] min-w-0', body: 'min-w-0' }" :dismissible="false">

		<!-- Modal Header -->
		<template #header>
			<div class="flex items-center justify-center gap-3">
				<UIcon name="i-lucide-award" class="text-primary size-5" />
				<h3 class="text-lg font-bold text-white">{{ $t('victory.title') }}</h3>
			</div>
		</template>

		<!-- Modal Body -->
		<template #body>

			<div class="flex flex-col space-y-2">

				<UAlert variant="subtle" color="success" class="text-center" icon="i-lucide-award"
					:description="$t('victory.message')" />

				<div class="rounded-md bg-neutral-800 p-2 flex justify-between items-center text-xs">
					<span>{{ $t('scenario_' + gameStore.currentScenarioId) }}</span>
					<span>{{ formatTime(gameStore.totalPlayTime) }}</span>
				</div>

			</div>

			<div class="flex justify-center">
				<UButton color="primary" variant="subtle"
					@click="isVictoryModalOpen = false">
					{{ $t('victory.close') }}
				</UButton>
			</div>

		</template>

	</UModal>

</template>