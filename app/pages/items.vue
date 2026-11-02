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

	<section v-for="(items, group) in groupedItems" :key="group" class="flex flex-col gap-3">

		<h2 class="text-center text-xs font-semibold text-neutral-400">{{ group }}</h2>

		<div class="flex items-center justify-center gap-3">
			<UButton v-for="item in items" :key="item.id"
				color="neutral" variant="subtle" class="aspect-square size-10"
				@click="openItem(item)">
				<img :src="item.img" alt="" class="size-full object-contain" />
			</UButton>
		</div>

	</section>

	<UModal v-model:open="isItemModalOpen">
		<template #content>
			<UCard v-if="selectedItem">

				<template #header>
					<div class="flex items-center justify-between">

						<div class="flex items-center gap-3">
							<img :src="selectedItem.img" alt="" class="size-5 object-contain" />
							<h3 class="text-lg font-bold text-white">{{ $t('items.' + selectedItem.id) }}</h3>
						</div>

						<UButton color="neutral" variant="ghost" icon="i-lucide-x"
							@click="isItemModalOpen = false" />

					</div>
				</template>

				<div class="flex flex-col space-y-6">

					<div class="grid grid-cols-2 gap-3">

						<UCard variant="subtle" :ui="{ 'body': 'sm:p-3 p-3' }">
							<div class="flex flex-col gap-1">
								<span class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.count') }}</span>
								<span class="font-semibold">{{ selectedItem.count }} / {{ selectedItem.max }}</span>
							</div>
						</UCard>

						<UCard variant="subtle" :ui="{ 'body': 'sm:p-3 p-3' }">
							<div class="flex flex-col gap-1">
								<span class="text-xs font-semibold text-neutral-400">{{ $t('modalItem.production') }}</span>
								<span class="font-semibold">{{ selectedItem.production }}</span>
							</div>
						</UCard>

					</div>

				</div>

			</UCard>
		</template>
	</UModal>

</template>
