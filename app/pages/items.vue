<script setup lang="ts">

	import { computed, ref } from 'vue'
	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

	const groupedItems = computed(() => {

		return gameStore.items.filter((item: any) => item.type === 'item').reduce((groups: Record<string, any[]>, item: any) => {
			const group = item.group
			const groupItems = groups[group] || (groups[group] = [])
			groupItems.push(item)
			return groups
		}, {})
	})

</script>

<template>

	<!-- Item Groups -->
	<section v-for="(items, group) in groupedItems" :key="group" class="flex flex-col gap-2">

		<h2 class="text-center text-xs font-semibold text-neutral-400">{{ $t('groups.' + group) }}</h2>

		<div class="flex flex-wrap items-center justify-center gap-2">
			<UTooltip v-for="item in items" :key="item.id" :text="$t(`items.${item.id}`)">

				<UButton v-if="gameStore.itemUnlockeds[item.id]" color="neutral" variant="subtle" class="relative aspect-square size-11"
					@click="gameStore.openItem(item.id)">

					<img :src="gameStore.itemImgs[item.id]" :alt="$t(`items.${item.id}`)" class="size-full object-contain" />

					<UBadge v-if="item.count != 0" size="xs" color="neutral" variant="subtle"
						class="absolute -top-1 -right-0.5 z-10">
						<span v-if="item.count.toFixed(0) >= item.max" class="text-error">{{ item.count.toFixed(0) }}</span>
						<span v-else-if="item.count > 0" class="text-white">{{ item.count.toFixed(0) }}</span>
						<span v-else-if="item.count < 0" class="text-error">{{ item.count.toFixed(0) }}</span>
					</UBadge>

					<UBadge v-if="gameStore.itemProductionRates[item.id] != 0" size="xs" color="neutral" variant="subtle"
						class="absolute -bottom-1 -right-0.5 z-10">
						<span v-if="gameStore.itemProductionRates[item.id] > 0" class="text-success">+{{ gameStore.itemProductionRates[item.id].toFixed(1) }} /s</span>
						<span v-else-if="gameStore.itemProductionRates[item.id] < 0" class="text-error">{{ gameStore.itemProductionRates[item.id].toFixed(1) }} /s</span>
					</UBadge>

				</UButton>

				<UButton v-else color="neutral" variant="subtle" class="aspect-square size-11 justify-center"
					@click="gameStore.openLocked(item.id)">
					<UIcon name="i-lucide-lock" class="text-muted" />
				</UButton>

			</UTooltip>
		</div>

	</section>

</template>
