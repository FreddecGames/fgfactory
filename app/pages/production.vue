<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()
const { te, t } = useI18n()
const selectedProduction = ref<any | null>(null)
const isProductionModalOpen = ref(false)

const groupedProductions = computed(() => {
	return gameStore.prods.reduce((groups: Record<string, any[]>, prod: any) => {
		const group = prod.group || 'other'
		const groupProductions = groups[group] || (groups[group] = [])
		groupProductions.push(prod)
		return groups
	}, {})
})

function getGroupLabel(group: string) {
	const key = `groups.${group}`
	return te(key) ? t(key) : group
}

const selectedMachine = computed(() => {
	if (!selectedProduction.value) return null

	return gameStore.machines.find((machine: any) => machine.id === selectedProduction.value.machineId) ?? null
})

function openProduction(prod: any) {
	selectedProduction.value = prod
	isProductionModalOpen.value = true
}
</script>

<template>
	<div v-if="gameStore.prods.length === 0" class="py-8 text-center text-sm text-neutral-500">
		{{ $t('production.noLines') }}
	</div>

	<div v-else class="flex flex-col gap-6">
		<section v-for="(productions, group) in groupedProductions" :key="group" class="flex flex-col gap-3">
			<h2 class="text-center text-xs font-semibold text-neutral-400">{{ getGroupLabel(group) }}</h2>

			<div class="flex flex-wrap justify-center gap-3">
				<UButton
					v-for="prod in productions"
					:key="prod.id"
					color="neutral"
					variant="subtle"
					class="size-12 justify-center p-2"
					:aria-label="$t(`items.${prod.machineId}`)"
					@click="openProduction(prod)"
				>
					<img :src="gameStore.machines.find((machine: any) => machine.id === prod.machineId)?.img"
						:alt="$t(`items.${prod.machineId}`)" class="size-full object-contain" />
				</UButton>
			</div>
		</section>
	</div>

	<UModal v-model:open="isProductionModalOpen" scrollable>
		<template #content>
			<UCard v-if="selectedProduction">
				<template #header>
					<div class="flex items-center justify-between gap-3">
						<div class="flex min-w-0 items-center gap-3">
							<img v-if="selectedMachine" :src="selectedMachine.img"
								:alt="$t(`items.${selectedMachine.id}`)" class="size-6 object-contain" />
							<div class="min-w-0">
								<h2 class="truncate text-lg font-bold text-white">
									{{ $t(`items.${selectedProduction.recipeId}`) }}
								</h2>
								<p class="truncate text-xs text-neutral-400">
									{{ $t(`items.${selectedProduction.machineId}`) }}
								</p>
							</div>
						</div>
						<UButton color="neutral" variant="ghost" icon="i-lucide-x"
							:aria-label="$t('production.close')"
							@click="isProductionModalOpen = false" />
					</div>
				</template>

				<div class="flex flex-col gap-6">
					<section class="flex flex-col gap-3">
						<h3 class="text-xs font-semibold text-neutral-400">{{ $t('production.inputs') }}</h3>

						<div v-if="selectedProduction.inputs.length > 0" class="flex flex-col gap-2">
							<div v-for="input in selectedProduction.inputs" :key="input.id"
								class="flex items-center justify-between gap-3 rounded-md bg-neutral-800/60 p-2">
								<div class="flex min-w-0 items-center gap-2">
									<img :src="gameStore.itemMap[input.id]?.img" :alt="$t(`items.${input.id}`)"
										class="size-6 shrink-0 object-contain" />
									<span class="truncate text-sm">{{ $t(`items.${input.id}`) }}</span>
								</div>
								<span class="shrink-0 text-sm font-semibold">
									{{ input.bufferCount }} / {{ input.bufferMax }}
								</span>
							</div>
						</div>
						<p v-else class="text-sm text-neutral-500">{{ $t('production.noInputs') }}</p>
					</section>

					<section class="flex flex-col gap-3">
						<h3 class="text-xs font-semibold text-neutral-400">{{ $t('production.machines') }}</h3>

						<div v-if="selectedMachine" class="flex items-center justify-between gap-3 rounded-md bg-neutral-800/60 p-3">
							<div class="flex min-w-0 items-center gap-2">
								<img :src="selectedMachine.img" :alt="$t(`items.${selectedMachine.id}`)"
									class="size-8 shrink-0 object-contain" />
								<div class="min-w-0">
									<p class="truncate text-sm font-semibold">{{ $t(`items.${selectedMachine.id}`) }}</p>
									<p class="text-xs text-neutral-400">
										{{ $t('production.assigned') }}: {{ selectedProduction.assignedCount }} /
										{{ selectedMachine.count }}
									</p>
								</div>
							</div>

							<div class="flex shrink-0 items-center gap-2">
								<UButton color="neutral" variant="subtle" icon="i-lucide-minus" size="xs"
									:aria-label="$t('production.unassignMachine')"
									:disabled="selectedProduction.assignedCount <= 0"
									@click="gameStore.unassignProductionMachine(selectedProduction)" />
								<UButton color="neutral" variant="subtle" icon="i-lucide-plus" size="xs"
									:aria-label="$t('production.assignMachine')"
									:disabled="gameStore.getAvailableMachineCount(selectedProduction.machineId) <= 0"
									@click="gameStore.assignProductionMachine(selectedProduction)" />
							</div>
						</div>
						<p v-else class="text-sm text-error">{{ $t('production.machineUnavailable') }}</p>
					</section>
				</div>
			</UCard>
		</template>
	</UModal>
</template>
