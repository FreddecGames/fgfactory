<!-- app/pages/production.vue -->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { BLUEPRINTS } from '~/utils/blueprints'
import { useGameStore } from '~/stores/game'

// Initialisation du store Pinia
const gameStore = useGameStore()

// Utilisation de storeToRefs pour conserver la réactivité des getters/state dans le template
const { factoriesByBuilding } = storeToRefs(gameStore)

// Mapping des fonctions de helpers immuables
const formatCost = (cost: Record<string, number>) => {
  return Object.entries(cost).map(([item, amount]) => `${amount}x ${item}`).join(', ')
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto space-y-8">
    <!-- En-tête de la page -->
    <div class="flex justify-between items-center border-b border-gray-700 pb-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Lignes de Production</h1>
        <p class="text-sm text-gray-400 mt-1">Gère tes infrastructures et automatise tes chaînes de montage via Pinia.</p>
      </div>
    </div>

    <!-- Grille principale par type de machine -->
    <div class="space-y-10">
      <div 
        v-for="(building, buildingId) in BLUEPRINTS.buildings" 
        :key="buildingId"
        class="border border-gray-800 rounded-xl p-5 bg-gray-900/30"
      >
        <!-- Section Header : Nom du bâtiment + Bouton d'achat -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
              <span>{{ building.name }}</span>
              <UBadge color="gray" variant="solid" size="xs">
                Possédées : {{ factoriesByBuilding[buildingId]?.length || 0 }}
              </UBadge>
            </h2>
            <p class="text-xs text-gray-400 mt-1">Coût : {{ formatCost(building.cost) }}</p>
          </div>

          <UButton
            :disabled="!gameStore.canBuyBuilding(buildingId)"
            color="primary"
            variant="solid"
            icon="i-heroicons-plus"
            @click="gameStore.buildFactory(buildingId)"
          >
            Construire
          </UButton>
        </div>

        <!-- Liste des instances de ce bâtiment -->
        <div v-if="factoriesByBuilding[buildingId]?.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UCard 
            v-for="factory in factoriesByBuilding[buildingId]" 
            :key="factory.id"
            class="bg-gray-900 border-gray-800"
          >
            <!-- Header de la Machine Card -->
            <template #header>
              <div class="flex justify-between items-center">
                <span class="text-xs font-mono text-gray-500 uppercase tracking-wider">{{ factory.id }}</span>
                
                <!-- Badge d'état dynamique -->
                <UBadge 
                  :color="factory.status === 'OPERATIONAL' ? 'green' : factory.status === 'FULL' ? 'red' : 'orange'"
                  variant="subtle"
                  size="xs"
                >
                  {{ factory.status }}
                </UBadge>
              </div>
            </template>

            <!-- Corps de la Machine Card : Configuration & Taux -->
            <div class="space-y-4">
              <!-- Sélecteur de recette lié à l'action Pinia -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-400">Recette assignée</label>
                <USelect
                  :model-value="factory.currentRecipeId"
                  :items="building.allowedRecipes"
                  class="w-full"
                  @update:model-value="(val) => gameStore.setFactoryRecipe(factory.id, val as string)"
                />
              </div>

              <!-- Barre de progression de production -->
              <div class="space-y-1">
                <div class="flex justify-between text-xs text-gray-400">
                  <span>Progression</span>
                  <span>{{ Math.round(factory.progress * 100) }}%</span>
                </div>
                <UProgress :value="factory.progress * 100" color="primary" size="sm" />
              </div>
            </div>

            <!-- Footer de la Machine Card : État des buffers internes -->
            <template #footer>
              <div class="text-xs space-y-1 text-gray-400">
                <div class="flex justify-between">
                  <span>Buffer Entrée :</span>
                  <span class="font-mono text-gray-300">
                    {{ Object.keys(factory.bufferIn).length ? factory.bufferIn : 'Vide' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span>Buffer Sortie :</span>
                  <span class="font-mono text-emerald-400">
                    {{ Object.keys(factory.bufferOut).length ? factory.bufferOut : 'Vide' }}
                  </span>
                </div>
              </div>
            </template>
          </UCard>
        </div>

        <!-- État vide pour ce bâtiment -->
        <div v-else class="text-center py-6 border border-dashed border-gray-800 rounded-lg bg-gray-950/40">
          <p class="text-sm text-gray-500">Aucune machine de ce type installée.</p>
        </div>
      </div>
    </div>
  </div>
</template>
