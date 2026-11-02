<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()
const selectedItem = ref<any | null>(null)
const isItemModalOpen = ref(false)

const groupedItems = computed(() => {
	return gameStore.items.reduce((groups: Record<string, any[]>, item: any) => {
		const group = item.group || 'other'
		const groupItems = groups[group] || (groups[group] = [])
		groupItems.push(item)
		return groups
	}, {})
})

function openItem(item: any) {
	selectedItem.value = item
	isItemModalOpen.value = true
}
</script>

<template>
	<div class="flex flex-col gap-6">
		<section v-for="(items, group) in groupedItems" :key="group" class="flex flex-col gap-3">
			<h2 class="text-sm font-semibold capitalize text-neutral-300">{{ group }}</h2>

			<div class="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
				<UButton
					v-for="item in items"
					:key="item.id"
					color="neutral"
					variant="subtle"
					class="aspect-square size-16 justify-center p-2"
					:aria-label="item.id"
					@click="openItem(item)"
				>
					<img :src="item.img" alt="" class="size-full object-contain" />
				</UButton>
			</div>
		</section>
	</div>

	<UModal v-model:open="isItemModalOpen">
		<template #content>
			<UCard v-if="selectedItem">
				<template #header>
					<div class="flex items-center justify-between gap-3">
						<h2 class="text-lg font-bold text-white">{{ selectedItem.id }}</h2>
						<UButton
							color="neutral"
							variant="ghost"
							icon="i-lucide-x"
							:aria-label="$t('items.close')"
							@click="isItemModalOpen = false"
						/>
					</div>
				</template>

				<div class="flex flex-col items-center gap-4">
					<img :src="selectedItem.img" :alt="selectedItem.id" class="size-24 object-contain" />
					<div class="flex w-full justify-between gap-4 text-sm">
						<span class="text-neutral-400">{{ $t('items.count') }}</span>
						<span class="font-semibold">{{ selectedItem.count }}</span>
					</div>
					<div v-if="Number.isFinite(selectedItem.max)" class="flex w-full justify-between gap-4 text-sm">
						<span class="text-neutral-400">{{ $t('items.capacity') }}</span>
						<span class="font-semibold">{{ selectedItem.max }}</span>
					</div>
				</div>
			</UCard>
		</template>
	</UModal>
</template>
