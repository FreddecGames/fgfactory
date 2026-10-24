<!-- app/layouts/default.vue -->
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useGameStore } from '~/stores/game'
import { processGameTick } from '~/utils/gameEngine'

const gameStore = useGameStore()
let animationFrameId: number
let lastTimestamp = 0

const runGameLoop = (timestamp: number) => {
  if (!lastTimestamp) lastTimestamp = timestamp
  
  // Calcul du delta de temps en secondes
  const deltaTime = (timestamp - lastTimestamp) / 1000
  lastTimestamp = timestamp

  // On passe directement l'état réactif de Pinia au moteur de calcul mathématique
  processGameTick(gameStore.$state, deltaTime)

  animationFrameId = requestAnimationFrame(runGameLoop)
}

onMounted(() => {
  animationFrameId = requestAnimationFrame(runGameLoop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
    <!-- Barre de navigation Nuxt UI -->
    <header class="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <span class="font-bold tracking-wider text-primary-500 font-mono">🏭 FG_FACTORY_OS</span>
        <nav class="flex gap-2">
          <UButton to="/inventory" variant="ghost" color="gray" icon="i-heroicons-cube">Inventaire</UButton>
          <UButton to="/production" variant="ghost" color="gray" icon="i-heroicons-wrench-screwdriver">Production</UButton>
        </nav>
      </div>
    </header>

    <!-- Contenu dynamique des pages du jeu -->
    <main class="flex-1">
      <NuxtPage />
    </main>
  </div>
</template>
