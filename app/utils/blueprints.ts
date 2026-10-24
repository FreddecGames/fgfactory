// Données statiques du jeu - Équilibrage immuable
export const BLUEPRINTS = {
  items: {
    iron_ore: { id: 'iron_ore', name: 'Minerai de fer' },
    iron_plate: { id: 'iron_plate', name: 'Plaque de fer' },
    copper_wire: { id: 'copper_wire', name: 'Fil de cuivre' }
  },
  buildings: {
    miner: {
      id: 'miner',
      name: 'Foreuse thermique',
      cost: { iron_plate: 10 },
      allowedRecipes: ['iron_ore_mining']
    },
    smelter: {
      id: 'smelter',
      name: 'Fonderie électrique',
      cost: { iron_plate: 20, copper_wire: 15 },
      allowedRecipes: ['iron_smelting']
    }
  },
  recipes: {
    iron_ore_mining: { 
      id: 'iron_ore_mining', 
      name: 'Extraction de Fer', 
      duration: 2, 
      inputs: [], 
      outputs: [{ itemId: 'iron_ore', amount: 1 }] 
    },
    iron_smelting: { 
      id: 'iron_smelting', 
      name: 'Fonte du Fer', 
      duration: 3, 
      inputs: [{ itemId: 'iron_ore', amount: 1 }], 
      outputs: [{ itemId: 'iron_plate', amount: 1 }] 
    }
  }
} as const;
