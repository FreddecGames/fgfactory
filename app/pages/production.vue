<!-- app/pages/production.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { BLUEPRINTS } from '~/utils/blueprints'
import { useGameStore, type FactoryInstance } from '~/stores/game'

// Initialisation du store Pinia
const gameStore = useGameStore()
const { factoriesByBuilding, factories } = storeToRefs(gameStore)

// --- ÉTATS POUR LA MODALE COMMUNE ---
const isModalOpen = ref(false)
const selectedFactoryId = ref<string | null>(null)

// Récupère dynamiquement l'instance de la machine sélectionnée en temps réel
const activeFactory = computed<FactoryInstance | null>(() => {
  if (!selectedFactoryId.value) return null
  return factories.value[selectedFactoryId.value] || null
})

// --- HELPERS D'AFFICHAGE ---
const openFactoryPanel = (factoryId: string) => {
  selectedFactoryId.value = factoryId
  isModalOpen.value = true
}

const formatCost = (cost: Record<string, number>) => {
  return Object.entries(cost).map(([item, amount]) => `${amount}x ${item}`).join(', ')
}

const getItemName = (itemId: string) => {
  return BLUEPRINTS.items[itemId as keyof typeof BLUEPRINTS.items]?.name || itemId
}

const getRecipe = (recipeId: string | null) => {
  if (!recipeId) return null
  return BLUEPRINTS.recipes[recipeId as keyof typeof BLUEPRINTS.recipes]
}

// Détermine la couleur du badge/bouton en fonction du statut de la machine
const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPERATIONAL': return 'green'
    case 'FULL': return 'red'
    case 'MISSING_INGREDIENTS': return 'orange'
    default: return 'gray'
  }
}
</script>

<template>
  <div class="p-4 max-w-md mx-auto space-y-6 pb-20">
    <!-- En-tête de la page épuré pour Mobile -->
    <div class="border-b border-gray-800 pb-3">
      <h1 class="text-2xl font-bold tracking-tight">Zone de Production</h1>
      <p class="text-xs text-gray-400 mt-0.5">Appuie sur une machine pour la configurer.</p>
    </div>

    <!-- Liste des catégories de bâtiments -->
    <div class="space-y-6">
      <div 
        v-for="(building, buildingId) in BLUEPRINTS.buildings" 
        :key="buildingId"
        class="border border-gray-800 rounded-xl p-4 bg-gray-900/20 space-y-3"
      >
        <!-- En-tête de catégorie avec bouton d'achat compact -->
        <div class="flex items-center justify-between gap-2">
          <div>
            <h2 class="text-base font-semibold text-white">
              {{ building.name }}
            </h2>
            <p class="text-[10px] text-gray-500">Achat : {{ formatCost(building.cost) }}</p>
          </div>

          <UButton
            :disabled="!gameStore.canBuyBuilding(buildingId)"
            color="primary"
            variant="solid"
            size="xs"
            icon="i-heroicons-plus"
            @click="gameStore.buildFactory(buildingId)"
          >
            Acheter
          </UButton>
        </div>

        <!-- 📱 LISTE DE BOUTONS COMPACTS (Un bouton par instance de machine) -->
        <div v-if="factoriesByBuilding[buildingId]?.length > 0" class="space-y-2">
          <button 
            v-for="factory in factoriesByBuilding[buildingId]" 
            :key="factory.id"
            class="w-full flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-gray-950 text-left active:bg-gray-900 transition-colors focus:outline-none"
            @click="openFactoryPanel(factory.id)"
          >
            <!-- Nom technique & Progression en arrière-plan -->
            <div class="flex flex-col gap-1 w-full mr-4">
              <div class="flex justify-between items-center text-xs font-medium text-gray-300">
                <span class="font-mono text-gray-400">{{ factory.id }}</span>
                <span class="text-gray-500 font-mono text-[11px]">{{ Math.round(factory.progress * 100) }}%</span>
              </div>
              <!-- Mini barre de progression intégrée sous le bouton -->
              <UProgress :value="factory.progress * 100" :color="getStatusColor(factory.status)" size="2xs" />
            </div>

            <!-- Pastille d'état colorée (Notification visuelle rapide) -->
            <span 
              class="w-2.5 h-2.5 rounded-full shrink-0" 
              :class="{
                'bg-emerald-500': factory.status === 'OPERATIONAL',
                'bg-red-500': factory.status === 'FULL',
                'bg-orange-500': factory.status === 'MISSING_INGREDIENTS',
                'bg-gray-500': factory.status === 'STANDBY'
              }"
            />
          </button>
        </div>

        <!-- État vide -->
        <div v-else class="text-center py-4 border border-dashed border-gray-800 rounded-lg text-xs text-gray-500">
          Aucun équipement déployé.
        </div>
      </div>
    </div>

    <!-- 🎛️ MODALE UNIQUE POUR LES DÉTAILS DE LA MACHINE SÉLECTIONNÉE -->
    <UModal v-model:open="isModalOpen">
      <div v-if="activeFactory" class="p-5 space-y-5 bg-gray-900 text-gray-100 rounded-xl border border-gray-800">
        
        <!-- En-tête de la modale -->
        <div class="flex justify-between items-start border-b border-gray-800 pb-3">
          <div>
            <h3 class="text-lg font-bold text-white">
              {{ BLUEPRINTS.buildings[activeFactory.buildingId as keyof typeof BLUEPRINTS.buildings]?.name }}
            </h3>
            <span class="text-xs font-mono text-gray-500">{{ activeFactory.id }}</span>
          </div>
          <UBadge :color="getStatusColor(activeFactory.status)" variant="subtle" size="xs">
            {{ activeFactory.status }}
          </UBadge>
        </div>

        <!-- Sélecteur de recette tactile -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recette Active</label>
          <USelect
            :model-value="activeFactory.currentRecipeId"
            :items="BLUEPRINTS.buildings[activeFactory.buildingId as keyof typeof BLUEPRINTS.buildings]?.allowedRecipes"
            class="w-full"
            size="md"
            @update:model-value="(val) => gameStore.setFactoryRecipe(activeFactory!.id, val as string)"
          />
        </div>

        <!-- Récapitulatif des flux d'ingrédients -->
        <div v-if="getRecipe(activeFactory.currentRecipeId)" class="grid grid-cols-2 gap-3 border border-gray-800 rounded-lg p-3 bg-gray-950/60">
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-gray-500 uppercase">Besoins</span>
            <div v-if="getRecipe(activeFactory.currentRecipeId)?.inputs.length" class="space-y-0.5">
              <div v-for="input in getRecipe(activeFactory.currentRecipeId)?.inputs" :key="input.itemId" class="text-xs flex justify-between font-mono">
                <span class="text-gray-400">{{ getItemName(input.itemId) }}</span>
                <span class="text-orange-400 font-bold">x{{ input.amount }}</span>
              </div>
            </div>
            <div v-else class="text-xs text-emerald-500 italic font-mono text-[11px]">Ressource libre</div>
          </div>

          <div class="space-y-1 border-l border-gray-800 pl-3">
            <span class="text-[10px] font-bold text-gray-500 uppercase">Production</span>
            <div class="space-y-0.5">
              <div v-for="output in getRecipe(activeFactory.currentRecipeId)?.outputs" :key="output.itemId" class="text-xs flex justify-between font-mono">
                <span class="text-gray-400">{{ getItemName(output.itemId) }}</span>
                <span class="text-emerald-400 font-bold">+{{ output.amount }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- État des stocks (Buffers internes) -->
        <div class="space-y-2 border-t border-gray-800 pt-3 text-xs">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Réserves de la machine</span>
          
          <div class="flex justify-between items-center font-mono py-1">
            <span class="text-gray-400">Stock Entrée :</span>
            <span class="text-gray-300 font-bold">
              {{ Object.keys(activeFactory.bufferIn).length ? activeFactory.bufferIn : 'Vide' }}
            </span>
          </div>
          
          <div class="flex justify-between items-center font-mono py-1">
            <span class="text-gray-400">Stock Sortie :</span>
            <span class="text-emerald-400 font-bold">
              {{ Object.keys(activeFactory.bufferOut).length ? activeFactory.bufferOut : 'Vide' }}
            </span>
          </div>
        </div>

        <!-- Bouton Fermer pour quitter la modale (Tactile) -->
        <div class="pt-2">
          <UButton block color="gray" variant="solid" size="md" @click="isModalOpen = false">
            Fermer le panneau
          </UButton>
        </div>

      </div>
    </UModal>
	
  </div>
</template>
