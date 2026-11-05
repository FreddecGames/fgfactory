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

</script>

<template>

	<!-- Item Groups -->
	<section v-for="(machines, group) in groupedMachines" :key="group" class="flex flex-col gap-2">

		<h2 class="text-center text-xs font-semibold text-neutral-400">{{ $t('groups.' + group) }}</h2>

		<div class="flex flex-wrap items-center justify-center gap-2">
			<UTooltip v-for="machine in machines" :key="machine.id" :text="$t(`items.${machine.id}`)">
				<UButton color="neutral" variant="subtle" class="relative aspect-square size-10"
					@click="openMachine(machine)">

					<img :src="machine.img" alt="" class="size-full object-contain" />

					<UBadge size="xs" color="neutral" variant="subtle"
						class="absolute -top-0.5 -right-0.5 z-10">
						<span>{{ machine.count.toFixed(0) }}</span>
					</UBadge>

				</UButton>
			</UTooltip>
		</div>

	</section>

	<!-- Item Modal -->
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
		</template>

	</UModal>

</template>