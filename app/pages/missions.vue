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

</script>

<template>

	<!-- Mission Groups -->
	<section v-for="(missions, group) in groupedMissions" :key="group" class="flex flex-col gap-2">

		<h2 class="text-center text-xs font-semibold text-neutral-400">{{ $t('groups.' + group) }}</h2>

		<div class="flex flex-wrap items-center justify-center gap-2">
			<UTooltip v-for="mission in missions" :key="mission.id" :text="$t(`items.${mission.id}`)">
				<UButton color="neutral" variant="subtle" class="relative aspect-square size-10"
					@click="gameStore.openMission(mission.id)">

					<img :src="gameStore.itemImgs[mission.id]" :alt="$t(`items.${mission.id}`)" class="size-full object-contain" />

					<UBadge v-if="mission.count != 0" size="xs" :color="mission.count >= mission.max ? 'success' : 'neutral'" variant="solid"
						class="absolute -top-0.5 -right-0.5 z-10">
						<span v-if="mission.count >= mission.max"><UIcon name="i-lucide-check" /></span>
						<span v-else-if="mission.count > 0">{{ mission.count.toFixed(0) }} / {{ mission.max.toFixed(0) }}</span>
					</UBadge>

				</UButton>
			</UTooltip>
		</div>

	</section>

</template>
