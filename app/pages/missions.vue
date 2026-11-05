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

</script>

<template>

	<!-- Item Groups -->
	<section v-for="(missions, group) in groupedMissions" :key="group" class="flex flex-col gap-2">

		<h2 class="text-center text-xs font-semibold text-neutral-400">{{ $t('groups.' + group) }}</h2>

		<div class="flex flex-wrap items-center justify-center gap-2">
			<UTooltip v-for="mission in missions" :key="mission.id" :text="$t(`items.${mission.id}`)">
				<UButton color="neutral" variant="subtle" class="relative aspect-square size-10"
					@click="openMission(mission)">

					<img :src="mission.img" alt="" class="size-full object-contain" />

					<UBadge size="xs" color="neutral" variant="subtle"
						class="absolute -top-0.5 -right-0.5 z-10">
						<span>{{ mission.count.toFixed(0) }}</span>
					</UBadge>

				</UButton>
			</UTooltip>
		</div>

	</section>

	<!-- Item Modal -->
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
		</template>

	</UModal>

</template>
