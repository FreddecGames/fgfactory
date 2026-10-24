<!-- app/pages/inventory.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { BLUEPRINTS } from '~/utils/blueprints'
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()

// 1. Les données passées à la table
const inventoryRows = computed(() => {
  return Object.entries(gameStore.inventory).map(([itemId, amount]) => {
    const itemBlueprint = BLUEPRINTS.items[itemId as keyof typeof BLUEPRINTS.items]
    return {
      id: itemId,
      name: itemBlueprint?.name || itemId,
      quantity: amount // Cette propriété sera lue par accessorKey
    }
  })
})

// 2. Déclaration stricte des colonnes selon les spécifications Nuxt UI v3
const columns = [
  { 
    id: 'name', 
    accessorKey: 'name', 
    header: 'Ressource' 
  },
  { 
    id: 'quantity', 
    accessorKey: 'quantity', 
    header: 'Quantité en Stock'
  }
]

const getItemName = (itemId: string) => {
  return BLUEPRINTS.items[itemId as keyof typeof BLUEPRINTS.items]?.name || itemId
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto space-y-8">
    <div class="flex justify-between items-center border-b border-gray-700 pb-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Inventaire & Atelier</h1>
        <p class="text-sm text-gray-400 mt-1">Consulte tes réserves de matériaux et assemble tes premiers composants à la main.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- COLONNE GAUCHE : L'Entrepôt des stocks -->
      <section class="lg:col-span-5 space-y-4">
        <h2 class="text-xl font-semibold text-white flex items-center gap-2">
          <UIcon name="i-heroicons-cube" class="text-primary-500" />
          <span>Stocks Actuels</span>
        </h2>

        <div class="border border-gray-800 rounded-xl bg-gray-900/20 overflow-hidden">
          <!-- ⚠️ ATTENTION : Remplacement de :rows par :data en v3 -->
          <UTable :data="inventoryRows" :columns="columns" class="w-full">
            
            <!-- ⚠️ ATTENTION : Le slot utilise désormais suffixe "-cell" au lieu de "-data" -->
            <!-- On extrait la valeur brute directement depuis { cell } -->
            <template #quantity-cell="{ cell }">
              <div class="text-right font-mono font-semibold">
                <span :class="Number(cell.getValue()) > 0 ? 'text-emerald-400' : 'text-gray-600'">
                  {{ Number(cell.getValue()).toLocaleString() }}
                </span>
              </div>
            </template>

          </UTable>
        </div>
      </section>

      <!-- COLONNE DROITE : L'Atelier d'Artisanat Manuel -->
      <section class="lg:col-span-7 space-y-4">
        <h2 class="text-xl font-semibold text-white flex items-center gap-2">
          <UIcon name="i-heroicons-hammer" class="text-primary-500" />
          <span>Artisanat Manuel</span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UCard 
            v-for="recipe in Object.values(BLUEPRINTS.recipes)" 
            :key="recipe.id"
            class="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors flex flex-col justify-between"
          >
            <template #header>
              <h3 class="font-semibold text-sm text-white">{{ recipe.name }}</h3>
              <p class="text-xs text-gray-500 mt-0.5">Temps requis : {{ recipe.duration }}s</p>
            </template>

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
