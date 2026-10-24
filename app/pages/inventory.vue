<!-- app/pages/inventory.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { BLUEPRINTS } from '~/utils/blueprints'
import { useGameStore } from '~/stores/game'

// Initialisation du store Pinia
const gameStore = useGameStore()

// 1. Préparation des données pour le tableau des stocks (UTable)
// Transforme le dictionnaire de l'inventaire en un tableau d'objets lisible par le composant
const inventoryRows = computed(() => {
  return Object.entries(gameStore.inventory).map(([itemId, amount]) => {
    const itemBlueprint = BLUEPRINTS.items[itemId as keyof typeof BLUEPRINTS.items]
    return {
      id: itemId,
      name: itemBlueprint?.name || itemId,
      quantity: amount
    }
  })
})

// Définition des colonnes du tableau Nuxt UI
const columns = [
  { key: 'name', label: 'Ressource' },
  { key: 'quantity', label: 'Quantité en Stock', align: 'right' as const }
]

// 2. Filtrer les recettes qui peuvent être fabriquées manuellement
// (Dans Factorio, certaines recettes complexes nécessitent obligatoirement une machine)
const manualRecipes = computed(() => {
  return Object.values(BLUEPRINTS.recipes)
})

// Helper pour récupérer proprement le nom d'un ingrédient depuis les blueprints
const getItemName = (itemId: string) => {
  return BLUEPRINTS.items[itemId as keyof typeof BLUEPRINTS.items]?.name || itemId
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto space-y-8">
    <!-- En-tête de la page -->
    <div class="flex justify-between items-center border-b border-gray-700 pb-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Inventaire & Atelier</h1>
        <p class="text-sm text-gray-400 mt-1">Consulte tes réserves de matériaux et assemble tes premiers composants à la main.</p>
      </div>
    </div>

    <!-- Grille principale à deux colonnes -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- COLONNE GAUCHE : L'Entrepôt des stocks (Prend 5 colonnes sur 12) -->
      <section class="lg:col-span-5 space-y-4">
        <h2 class="text-xl font-semibold text-white flex items-center gap-2">
          <UIcon name="i-heroicons-cube" class="text-primary-500" />
          <span>Stocks Actuels</span>
        </h2>

        <div class="border border-gray-800 rounded-xl bg-gray-900/20 overflow-hidden">
          <UTable :rows="inventoryRows" :columns="columns" class="w-full">
            <!-- Personnalisation de la colonne Quantité pour ajouter du style de terminal -->
            <template #quantity-data="{ row }">
              <span class="font-mono font-semibold" :class="row.quantity > 0 ? 'text-gray-200' : 'text-gray-600'">
                {{ row.quantity.toLocaleString() }}
              </span>
            </template>
          </UTable>
        </div>
      </section>

      <!-- COLONNE DROITE : L'Atelier d'Artisanat Manuel (Prend 7 colonnes sur 12) -->
      <section class="lg:col-span-7 space-y-4">
        <h2 class="text-xl font-semibold text-white flex items-center gap-2">
          <UIcon name="i-heroicons-hammer" class="text-primary-500" />
          <span>Artisanat Manuel</span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UCard 
            v-for="recipe in manualRecipes" 
            :key="recipe.id"
            class="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors flex flex-col justify-between"
          >
            <!-- Nom de l'objet à fabriquer -->
            <template #header>
              <h3 class="font-semibold text-sm text-white">{{ recipe.name }}</h3>
              <p class="text-xs text-gray-500 mt-0.5">Temps requis : {{ recipe.duration }}s</p>
            </template>

            <!-- Liste des ingrédients nécessaires -->
            <div class="space-y-2 py-1">
              <span class="text-xs font-medium text-gray-400">Coût de fabrication :</span>
              
              <ul v-if="recipe.inputs.length > 0" class="space-y-1">
                <li 
                  v-for="input in recipe.inputs" 
                  :key="input.itemId"
                  class="text-xs flex justify-between font-mono"
                >
                  <span class="text-gray-400">{{ getItemName(input.itemId) }}</span>
                  <span 
                    :class="(gameStore.inventory[input.itemId] || 0) >= input.amount ? 'text-emerald-400' : 'text-red-500'"
                  >
                    {{ gameStore.inventory[input.itemId] || 0 }} / {{ input.amount }}
                  </span>
                </li>
              </ul>
              
              <p v-else class="text-xs text-emerald-500 font-medium italic">
                Gratuit (Ressource de base)
              </p>
            </div>

            <!-- Bouton d'action pour fabriquer -->
            <template #footer>
              <UButton
                :disabled="!gameStore.canCraftManually(recipe.id)"
                color="primary"
                variant="solid"
                block
                icon="i-heroicons-wrench"
                @click="gameStore.craftItemManually(recipe.id)"
              >
                Fabriquer 1 unité
              </UButton>
            </template>
          </UCard>
        </div>
      </section>

    </div>
  </div>
</template>
