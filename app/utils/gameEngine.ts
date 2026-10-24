import { BLUEPRINTS } from './blueprints'

/**
 * Calcule l'avancement de la production de toutes les machines pour un tick donné.
 * Cette fonction traite les données brutes sans surcharge réactive.
 */
export function processGameTick(state: { factories: Record<string, any> }, deltaTime: number) {
  for (const id in state.factories) {
    const factory = state.factories[id]
    if (!factory.currentRecipeId || factory.status === 'STANDBY') continue

    const recipe = BLUEPRINTS.recipes[factory.currentRecipeId as keyof typeof BLUEPRINTS.recipes]
    if (!recipe) continue

    // 1. Gestion des entrées / Vérification des ressources du buffer
    let canRun = true
    for (const input of recipe.inputs) {
      if ((factory.bufferIn[input.itemId] || 0) < input.amount) {
        canRun = false
      }
    }

    if (!canRun) {
      factory.status = 'MISSING_INGREDIENTS'
      continue
    }

    // 2. Avancement du travail
    factory.status = 'OPERATIONAL'
    factory.progress += deltaTime / recipe.duration

    // 3. Fin de cycle : Consommation et production interne
    if (factory.progress >= 1) {
      // Consomme le buffer d'entrée
      for (const input of recipe.inputs) {
        factory.bufferIn[input.itemId] -= input.amount
      }
      // Produit dans le buffer de sortie
      for (const output of recipe.outputs) {
        factory.bufferOut[output.itemId] = (factory.bufferOut[output.itemId] || 0) + output.amount
      }
      factory.progress = 0 // Réinitialisation du cycle
    }
  }
}
