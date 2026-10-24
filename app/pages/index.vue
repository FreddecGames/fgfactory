<script setup lang="ts">

    import { useGameStore } from '~/stores/game'

    const gameStore = useGameStore()    

</script>

<template>

    <!-- Loading Card -->

    <div v-if="gameStore.isLoading" class="flex flex-col items-center justify-center py-12">

        <UCard>
            <div class="flex flex-col space-y-2">

                <h1 class="text-xl font-bold text-white flex items-center justify-center gap-2">
                    <UIcon name="i-lucide-factory" class="w-6 h-6 text-primary" />
                    FG Factory
                </h1>

				<UProgress size="sm" animation="carousel" class="w-64" />

            </div>
        </UCard>

    </div>

    <!-- Loading Error -->

    <div v-else-if="gameStore.loadingError" class="flex flex-col items-center justify-center py-12 gap-2">

        <UAlert color="error" variant="subtle" icon="i-lucide-alert-triangle"
            :title="gameStore.t('errors.title')" :description="gameStore.t(`errors.${gameStore.loadingError}`)" />

    </div>

    <!-- Main Screen -->

    <div v-else class="min-h-screen w-full flex flex-col">

		<!-- Page Header -->

        <div class="fixed top-0 z-50 w-full">
			<UContainer class="backdrop-blur max-w-3xl mx-auto bg-neutral-900/70 px-3">
						
				<header v-if="!gameStore.isLoading" class="pt-2 flex justify-between gap-3">

					<h1 class="text-xl font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-2">
						<UIcon name="i-lucide-factory" class="w-6 h-6 text-primary" />
						{{ gameStore.customGameName || gameStore.t('title') }}
					</h1>

					<UButton color="primary" variant="ghost" icon="i-lucide-settings-2" square size="md"
						@click="isOptionsOpen = true" />

				</header>

				<UTabs v-model="activeGroup" :items="groupTabs" size="sm"
					variant="link" :ui="{ list: 'justify-center' }" />

			</UContainer>
		</div>

		<!-- Page Content -->

        <UContainer class="pt-[84px] pb-[42px] flex-1 max-w-3xl mx-auto bg-neutral-900/70 px-3">

         </UContainer>

    </div>

 </template>