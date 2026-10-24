// app/stores/game.ts
import { defineStore } from 'pinia'
import { BLUEPRINTS } from '~/utils/blueprints'

// Définition des types stricts pour l'écosystème de l'usine
export interface FactoryInstance {
  id: string
  buildingId: string
  currentRecipeId: string | null
  progress: number
  status: 'STANDBY' | 'OPERATIONAL' | 'FULL' | 'MISSING_INGREDIENTS'
  bufferIn: Record<string, number>
  bufferOut: Record<string, number>
}

export interface GameState {
  inventory: Record<string, number>
  factories: Record<string, FactoryInstance>
}

export const useGameStore = defineStore('game', {
  // 1. L'État initial (Mutable) : Uniquement ce qui change en cours de jeu
  state: (): GameState => ({
    inventory: {
      iron_ore: 50,
      copper_ore: 20,
      iron_plate: 15,
      copper_wire: 0,
    },
    factories: {
      // Configuration de départ pour les tests du joueur
      miner_init: {
        id: 'miner_init',
        buildingId: 'miner',
        currentRecipeId: 'iron_ore_mining',
        progress: 0,
        status: 'STANDBY',
        bufferIn: {},
        bufferOut: {},
      }
    }
  }),

  // 2. Les Getters : Données dérivées calculées et mises en cache de façon réactive
  getters: {
    /**
     * Regroupe automatiquement toutes les instances de machines possédées par type de bâtiment.
     * Idéal pour le rendu organisé en accordéons/onglets sur la page /production.
     */
    factoriesByBuilding: (state) => {
      const groups: Record<string, FactoryInstance[]> = {}
      
      // Initialise les tableaux de groupes à partir de la liste immuable des blueprints
      Object.keys(BLUEPRINTS.buildings).forEach((bId) => {
        groups[bId] = []
      })

      // Distribue chaque machine existante dans son groupe respectif
      Object.values(state.factories).forEach((factory) => {
        if (groups[factory.buildingId]) {
          groups[factory.buildingId].push(factory)
        }
      })
      return groups
    },

    /**
     * Getter dynamique pour vérifier si le joueur a les ressources pour un bâtiment spécifique.
     * Utilisation : store.canBuyBuilding('smelter')
     */
    canBuyBuilding: (state) => {
      return (buildingId: string): boolean => {
        const building = BLUEPRINTS.buildings[buildingId as keyof typeof BLUEPRINTS.buildings]
        if (!building) return false
        
        return Object.entries(building.cost).every(
          ([itemId, amount]) => (state.inventory[itemId] || 0) >= amount
        )
      }
    },

    /**
     * Vérifie si l'artisanat manuel d'une recette est possible à partir des ressources de l'inventaire global.
     */
    canCraftManually: (state) => {
      return (recipeId: string): boolean => {
        const recipe = BLUEPRINTS.recipes[recipeId as keyof typeof BLUEPRINTS.recipes]
        if (!recipe) return false

        return recipe.inputs.every(
          (input) => (state.inventory[input.itemId] || 0) >= input.amount
        )
      }
    }
  },

  // 3. Les Actions : Les seuls déclencheurs autorisés à modifier l'état global
  actions: {
    /**
     * Construit une machine en consommant ses ressources et en l'ajoutant aux lignes de production.
     */
    buildFactory(buildingId: string) {
      if (!this.canBuyBuilding(buildingId)) return

      const building = BLUEPRINTS.buildings[buildingId as keyof typeof BLUEPRINTS.buildings]

      // Déduction du coût de construction de l'inventaire global
      Object.entries(building.cost).forEach(([itemId, amount]) => {
        this.inventory[itemId] -= amount
      })

      // Génération d'une nouvelle instance avec un horodatage unique
      const instanceId = `${buildingId}_${Date.now()}`
      
      this.factories[instanceId] = {
        id: instanceId,
        buildingId: buildingId,
        currentRecipeId: building.allowedRecipes[0] || null, // Assigne la première recette par défaut
        progress: 0,
        status: 'STANDBY',
        bufferIn: {},
        bufferOut: {},
      }
    },

    /**
     * Assigne de façon sécurisée une nouvelle recette à une machine donnée.
     * Réinitialise sa progression pour éviter de tricher lors d'un changement à la volée.
     */
    setFactoryRecipe(factoryId: string, recipeId: string) {
      const factory = this.factories[factoryId]
      if (factory) {
        factory.currentRecipeId = recipeId
        factory.progress = 0
        factory.status = 'STANDBY'
      }
    },

    /**
     * Permet au joueur d'effectuer un artisanat manuel instantané depuis son inventaire.
     * Lié directement aux boutons d'action de la page /inventory.
     */
    craftItemManually(recipeId: string) {
      if (!this.canCraftManually(recipeId)) return

      const recipe = BLUEPRINTS.recipes[recipeId as keyof typeof BLUEPRINTS.recipes]

      // 1. Consommer les ingrédients requis
      recipe.inputs.forEach((input) => {
        this.inventory[input.itemId] -= input.amount
      })

      // 2. Ajouter les produits générés dans l'inventaire
      recipe.outputs.forEach((output) => {
        this.inventory[output.itemId] = (this.inventory[output.itemId] || 0) + output.amount
      })
    }
  }
})
