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

</script>

<template>

	<!-- Machine Groups -->
	<section v-for="(machines, group) in groupedMachines" :key="group" class="flex flex-col gap-2">

		<h2 class="text-center text-xs font-semibold text-neutral-400">{{ $t('groups.' + group) }}</h2>

		<div class="flex flex-wrap items-center justify-center gap-2">
			<UTooltip v-for="machine in machines" :key="machine.id" :text="$t(`items.${machine.id}`)">
				<UButton color="neutral" variant="subtle" class="relative aspect-square size-10"
					@click="gameStore.openMachine(machine.id)">

					<img :src="gameStore.itemImgs[machine.id]" :alt="$t(`items.${machine.id}`)" class="size-full object-contain" />

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

</template>