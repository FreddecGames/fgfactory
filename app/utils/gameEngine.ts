// app/utils/gameEngine.ts
import { BLUEPRINTS } from './blueprints'

export function processGameTick(state: { factories: Record<string, any>, inventory: Record<string, number> }, deltaTime: number) {
  for (const id in state.factories) {
    const factory = state.factories[id]
    
    // Sécurité : s'assurer qu'une recette est bien sélectionnée
    if (!factory.currentRecipeId) continue

    const recipe = BLUEPRINTS.recipes[factory.currentRecipeId as keyof typeof BLUEPRINTS.recipes]
    if (!recipe) continue

    // 1. GESTION DES MACHINES DE TYPE SOURCE (Ex: Miner sans intrant)
    let canRun = true
    if (recipe.inputs && recipe.inputs.length > 0) {
      for (const input of recipe.inputs) {
        if ((factory.bufferIn[input.itemId] || 0) < input.amount) {
          canRun = false
        }
      }
    }

    if (!canRun) {
      factory.status = 'MISSING_INGREDIENTS'
      continue
    }

    // 2. AVANCEMENT DE LA PRODUCTION
    factory.status = 'OPERATIONAL'
    factory.progress += deltaTime / recipe.duration

    // 3. ENREGISTREMENT EN FIN DE CYCLE
    if (factory.progress >= 1) {
      // Consommation des intrants si existants
      if (recipe.inputs && recipe.inputs.length > 0) {
        for (const input of recipe.inputs) {
          factory.bufferIn[input.itemId] -= input.amount
        }
      }

      // SOLUTION LOGIQUE TEMPORAIRE :
      // Si c'est un Miner, on envoie DIRECTEMENT dans l'inventaire global du joueur 
      // pour que ça s'affiche sur la page /inventory.
      if (factory.buildingId === 'miner') {
        for (const output of recipe.outputs) {
          state.inventory[output.itemId] = (state.inventory[output.itemId] || 0) + output.amount
        }
      } else {
        // Pour les autres machines (Smelter), on stocke dans le bufferOut local
        for (const output of recipe.outputs) {
          factory.bufferOut[output.itemId] = (factory.bufferOut[output.itemId] || 0) + output.amount
        }
      }

      factory.progress = 0 // Réinitialisation pour le cycle suivant
    }
  }
}
