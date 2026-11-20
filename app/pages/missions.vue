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

				<UButton v-if="gameStore.itemUnlockeds[mission.id]" color="neutral" variant="subtle" class="relative aspect-square size-11"
					@click="gameStore.openMission(mission.id)">

					<img :src="gameStore.itemImgs[mission.id]" :alt="$t(`items.${mission.id}`)" class="size-full object-contain" />

					<UIcon v-if="mission.count != 0" name="i-lucide-award" class="absolute -top-1 -right-0.5 z-10 text-xs text-success" />

				</UButton>

				<UButton v-else color="neutral" variant="subtle" class="aspect-square size-11 justify-center"
					@click="gameStore.openLocked(mission.id)">
					<UIcon name="i-lucide-lock" class="text-muted" />
				</UButton>

			</UTooltip>
		</div>

	</section>

</template>
