// ./app/stores/game.ts

import { defineStore } from 'pinia'

const LOCAL_DATA_NAME = 'fgfactory_save'

const AVAILABLE_SCENARIOS = [

	{ id: "satisfactory", name: "scenarios.satisfactory" },
	{ id: "alchemy", name: "scenarios.alchemy" },
]

export const useGameStore = defineStore('game', {

	state: () => ({

		lastSaveDate: 0,
		saveIntervalId: null as ReturnType<typeof setInterval> | null,
		isRefreshing: false,

		currentScenarioId: AVAILABLE_SCENARIOS[0].id as string | null,
		totalPlayTime: 0,
		isPaused: false,

		winConditions: null as Record<string, number> | null,
		hasWon: false,

		items: [] as any[],
		recipes: [] as any[],

		links: [] as any[],
		prods: [] as any[],
		manuals: [] as any[],
		storages: [] as any[],
		
		itemMap: {} as Record<string, any>,
		prodMap: {} as Record<string, any>,
		itemInputMap: {} as Record<string, Map<string, any>>,
	}),

	getters: {

		scenarios: () => AVAILABLE_SCENARIOS,

		itemProductionRates: (state) => {

			const rates: Record<string, number> = {}

			for (const item of state.items)
				rates[item.id] = 0

			for (const prod of state.prods) {
				if (prod.seconds <= 0) continue

				for (const output of prod.outputs)
					rates[output.id] = (rates[output.id] || 0) + output.count * prod.assignedCount / prod.seconds
			}

			for (const link of state.links)
				rates[link.sourceItemId] = (rates[link.sourceItemId] || 0) - link.rate

			return rates
		},

		itemCounts: (state) => {

			const counts: Record<string, number> = {}

			for (const item of state.items)
				counts[item.id] = item.count

			return counts
		},

		itemAvailableCounts: (state) => {

			const counts: Record<string, number> = {}

			for (const item of state.items.filter(i => i.type === 'machine' || i.type === 'storer' || i.type === 'conveyor')) {

				let assignedCount = 0

				if (item.type === 'machine') {
					assignedCount = state.prods.reduce((total, prod) =>
						prod.machineId === item.id ? total + prod.assignedCount : total, 0)
				}
				else if (item.type === 'storer') {
					assignedCount = state.storages.reduce((total, storage) =>
						storage.storerId === item.id ? total + storage.assignedCount : total, 0)
				}
				else if (item.type === 'conveyor') {
					assignedCount = state.links.reduce((total, link) =>
						link.conveyorId === item.id ? total + link.assignedCount : total, 0)
				}

				counts[item.id] = Math.max(0, item.count - assignedCount)
			}

			return counts
		},
	},

	actions: {

		// Local data

		encryptData(obj: any): string {

			const jsonString = JSON.stringify(obj)

			return btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (_, p1) => {
				return String.fromCharCode(parseInt(p1, 16))
			}))
		},

		decryptData(cipherText: string): any {
			try {

				const decodedString = decodeURIComponent(Array.prototype.map.call(atob(cipherText), (c: string) => {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
				}).join(''))
	
				return JSON.parse(decodedString)
			}
			catch (e) {

				console.error("decrypt_failed", e)
				return null
			}
		},

		getEncryptedData(): string {
			const localData = {

				lastSaveDate: this.lastSaveDate,
				hasWon: this.hasWon,

				currentScenarioId: this.currentScenarioId,
				totalPlayTime: this.totalPlayTime,
				isPaused: this.isPaused,

				items: this.items.map(i => ({
					id: i.id,
					count: i.count,
					inputs: i.inputs ? i.inputs.map((input: any) => ({ id: input.id, count: input.count || 0, })) : null,
					manualSelectedCount: i.manualSelectedCount,
				})),

				links: this.links.map((link: any) => ({
					id: link.id,
					assignedCount: link.assignedCount || 0,
				})),

				prods: this.prods.map(p => ({
					id: p.id, 
					assignedCount: p.assignedCount || 0,
					progressSeconds: p.progressSeconds || 0,
					isProcessing: p.isProcessing || false,
					runMachineCount: p.runMachineCount || 0,
				})),

				manuals: this.manuals.map(m => ({
					id: m.id, 
					progressSeconds: m.progressSeconds || 0,
					isProcessing: m.isProcessing || false,
					queueCount: m.queueCount || 0,
				})),

				storages: this.storages.map(s => ({
					id: s.id,
					assignedCount: s.assignedCount || 0,
				}))
			}

			return this.encryptData(localData)
		},

		saveLocalData() {

			if (!import.meta.client) return

			this.lastSaveDate = Date.now()

			const encryptedString = this.getEncryptedData()
			localStorage.setItem(LOCAL_DATA_NAME, encryptedString)
		},

		startAutoSave(intervalMs: number = 30000) {

			if (!import.meta.client) return

			this.stopAutoSave()

			this.saveIntervalId = setInterval(() => {
				this.saveLocalData()
			}, intervalMs)
		},

		stopAutoSave() {

			if (this.saveIntervalId) {
				clearInterval(this.saveIntervalId)
				this.saveIntervalId = null
			}
		},

		wipeLocalData() {

			if (!import.meta.client) return

			this.isRefreshing = true
			this.stopAutoSave()

			localStorage.removeItem(LOCAL_DATA_NAME)

			window.location.reload()
		},

		resetLocalData() {

			if (!import.meta.client) return

			this.isRefreshing = true
			this.stopAutoSave()

			this.lastSaveDate = 0

			this.winConditions = null
			this.hasWon = false

			this.totalPlayTime = 0
			this.isPaused = false

			this.items = []
			this.recipes = []

			this.links = []
			this.prods = []
			this.manuals = []
			this.storages = []
			
			const encryptedString = this.getEncryptedData()
			localStorage.setItem(LOCAL_DATA_NAME, encryptedString)

			window.location.reload()
		},

		async importLocalData(data: string): Promise<boolean> {

			if (!data || data.trim() === '') return false
			if (!import.meta.client) return false

			this.isRefreshing = true
			this.stopAutoSave()

			localStorage.setItem(LOCAL_DATA_NAME, data)

			window.location.reload()

			return true
		},

		async switchScenario(newScenarioId: string) {

			if (!import.meta.client) return

			this.isRefreshing = true
			this.stopAutoSave()

			this.lastSaveDate = 0

			this.winConditions = null
			this.hasWon = false
			
			this.currentScenarioId = newScenarioId
			this.totalPlayTime = 0
			this.isPaused = false

			this.items = []
			this.recipes = []

			this.links = []
			this.prods = []
			this.manuals = []
			this.storages = []

			const encryptedString = this.getEncryptedData()
			localStorage.setItem(LOCAL_DATA_NAME, encryptedString)

			window.location.reload()
		},

		async loadLocalData() {

			if (!import.meta.client) return

			let decryptedLocalData: any = null
			const rawLocalData = localStorage.getItem(LOCAL_DATA_NAME)
			if (rawLocalData) decryptedLocalData = this.decryptData(rawLocalData)

			console.log(decryptedLocalData)
			
			if (decryptedLocalData && decryptedLocalData.currentScenarioId !== undefined)
				this.currentScenarioId = decryptedLocalData.currentScenarioId

			if (!AVAILABLE_SCENARIOS.some(s => s.id === this.currentScenarioId))
				this.currentScenarioId = AVAILABLE_SCENARIOS[0].id

			const [scenarioData] = await Promise.all([
				fetch(`/scenarios/${this.currentScenarioId}/data.json`).then(response => response.json())
			])

			// Victory conditions

			this.winConditions = scenarioData && scenarioData.winConditions ? scenarioData.winConditions : null	

			// Items

			this.items = []

			if (scenarioData && scenarioData.items) {
				scenarioData.items.forEach((itemData: any) => {
					this.items.push({
						id: itemData.id,
						img: `/scenarios/${this.currentScenarioId}/img/${itemData.id}.png`,
						name: 'item_' + itemData.id,
						type: itemData.type,
						group: itemData.group,
						stack: itemData.stack || Infinity,
						count: itemData.initialCount || 0,
						speed: itemData.speed || 0,
						inputs: [],
						energy: itemData.energy || {},
						storers: itemData.storers || [],
						conveyors: itemData.conveyors || [],
						requirement: itemData.requirement || {},
						manualCounts: [ 1, 5, 10 ],
						manualCountSelected: 1,
					})
				})
			}

			// Recipes

			this.recipes = []

			if (scenarioData && scenarioData.recipes) {
				scenarioData.recipes.forEach((recipeData: any) => {
					this.recipes.push({
						id: recipeData.id,
						seconds: recipeData.seconds,
						inputs: recipeData.inputs ? Object.entries(recipeData.inputs).map(([inputId, inputCount]: [string, any]) => ({ id: inputId, count: inputCount })) : [],
						outputs: recipeData.outputs ? Object.entries(recipeData.outputs).map(([outputId, outputCount]: [string, any]) => ({ id: outputId, count: outputCount })) : [],
						machines: recipeData.machines || []
					})
				})
			}

			// Storages

			this.storages = []

			const items = this.items.filter(item => item.storers && item.storers.length > 0)
			if (items.length > 0) {
				items.forEach(item => {
					item.storers.forEach((storerId: string) => {

						const storer = this.items.find(candidate => candidate.id === storerId)
						if (!storer) return

						this.storages.push({
							id: `${item.id}_${storerId}`,
							itemId: item.id,
							storerId: storerId,
							capacity: storer.speed * item.stack,
							assignedCount: 0
						})
					})
				})
			}

			// Manuals

			this.manuals = []

			let recipes = this.recipes.filter(recipe => recipe.machines && recipe.machines.includes('manual'))
			if (recipes.length > 0) {
				recipes.forEach(recipe => {

					const recipeInputs = [] as any[]
					if (recipe.inputs) {
						recipe.inputs.forEach(input => {
							
							const inputItem = this.items.find(i => i.id === input.id)

							recipeInputs.push({
								id: input.id, 
								img: inputItem.img,
								count: input.count, 
							})
						})
					}

					recipe.outputs && recipe.outputs.forEach(output => {
						this.manuals.push({

							id: `${output.id}_manual`,
							seconds: recipe.seconds,

							progressSeconds: 0,
							isProcessing: false,
							queueCount: 0,

							output: { id: output.id, count: output.count },
							inputs: [...recipeInputs],
						})
					})
				})
			}

			// Prods & Item Inputs & Links

			this.prods = []

			recipes = this.recipes.filter(recipe => recipe.machines && recipe.machines.some(machineId => machineId !== 'manual'))
			if (recipes.length > 0) {
				recipes.forEach(recipe => {

					const prodInputs = [] as any[]
					if (recipe.inputs) {
						recipe.inputs.forEach(input => {
							
							const inputItem = this.items.find(i => i.id === input.id)

							prodInputs.push({
								id: input.id, 
								img: inputItem.img,
								count: input.count, 
							})
						})
					}

					const prodOutputs = [] as any[]
					if (recipe.outputs) {
						recipe.outputs.forEach(output => {
							prodOutputs.push({ id: output.id, count: output.count })
						})
					}

					recipe.machines.forEach((machineId: string) => {

						const machine = this.items.find(candidate => candidate.id === machineId)
						if (!machine) return
						
						if (machine.energy) {
							Object.entries(machine.energy).forEach(([energyId, energyCount]: [string, any]) => {
							
								const energyItem = this.items.find(i => i.id === energyId)

								prodInputs.push({
									id: energyId,
									img: energyItem.img,
									count: energyCount * recipe.seconds / machine.speed,
								})
							})
						}

						this.prods.push({

							id: `${recipe.id}_${machineId}`,
							recipeId: recipe.id,
							machineId: machineId,

							seconds: recipe.seconds / machine.speed,
							assignedCount: 0,
							
							isProcessing: false,
							runMachineCount: 0,
							progressSeconds: 0,

							inputs: [...prodInputs],
							outputs: [...prodOutputs],
						})

						recipe.outputs.forEach(output => {

							const outputItem = this.items.find(candidate => candidate.id === output.id)
							if (!outputItem) return

							prodInputs.forEach(prodInput => {

								const outputItemInput = outputItem.inputs.find(candidate => candidate.id === prodInput.id)
								if (!outputItemInput) {

									outputItem.inputs.push({ id:prodInput.id, img:prodInput.img, count:0 })

									const inputItem = this.items.find(candidate => candidate.id === prodInput.id)
									if (!inputItem) return

									inputItem.conveyors.forEach(conveyorId => {

										const conveyorItem = this.items.find(i => i.id === conveyorId)
										
										this.links.push({

											id: `${prodInput.id}_${outputItem.id}_${conveyorId}`,
											sourceItemId: prodInput.id,
											targetItemId: outputItem.id,
											conveyorId: conveyorId,
											speed: conveyorItem.speed,

											assignedCount: 0,
											rate: 0,
										})
									});
								}
							})
						})
					})
				})
			}

			// Saved data

			if (decryptedLocalData) {
			
				if (decryptedLocalData.totalPlayTime !== undefined) this.totalPlayTime = decryptedLocalData.totalPlayTime

				if (decryptedLocalData.isPaused !== undefined) this.isPaused = decryptedLocalData.isPaused

				if (decryptedLocalData.hasWon !== undefined) this.hasWon = decryptedLocalData.hasWon

				if (decryptedLocalData.lastSaveDate !== undefined) this.lastSaveDate = decryptedLocalData.lastSaveDate

				if (decryptedLocalData.items) {
					decryptedLocalData.items.forEach((savedItem: any) => {

						const item = this.items.find(i => i.id === savedItem.id)
						if (item) {

							item.count = savedItem.count ?? 0
							item.manualSelectedCount = savedItem.manualSelectedCount ?? item.manualCounts[0]

							if (Array.isArray(savedItem.inputs)) {
								savedItem.inputs.forEach((savedInput: any) => {
									const itemInput = item.inputs.find((input: any) => input.id === savedInput.id)
									if (itemInput) itemInput.count = savedInput.count ?? 0
								})
							}
						}
					})
				}

				if (decryptedLocalData.links) {
					decryptedLocalData.links.forEach((savedLink: any) => {

						const link = this.links.find(l => l.id == savedLink.id)
						if (link) {

							link.assignedCount = savedLink.assignedCount ?? 0
						}
					})
				}

				if (decryptedLocalData.prods) {
					decryptedLocalData.prods.forEach((savedProd: any) => {

						const prod = this.prods.find(l => l.id == savedProd.id)
						if (prod) {

							prod.assignedCount = savedProd.assignedCount ?? 0
							prod.progressSeconds = savedProd.progressSeconds ?? 0
							prod.isProcessing = savedProd.isProcessing || false
							prod.runMachineCount = savedProd.runMachineCount ?? 0
						}
					})
				}

				if (decryptedLocalData.manuals) {
					decryptedLocalData.manuals.forEach((savedManual: any) => {

						const manual = this.manuals.find(m => m.id === savedManual.id)
						if (manual) {

							manual.progressSeconds = savedManual.progressSeconds ?? 0
							manual.isProcessing = savedManual.isProcessing || false
							manual.queueCount = savedManual.queueCount ?? 0
						}
					})
				}

				if (decryptedLocalData.storages) {
					decryptedLocalData.storages.forEach((savedStorage: any) => {

						const storage = this.storages.find(s => s.id === savedStorage.id)
						if (storage) {
							
							storage.assignedCount = savedStorage.assignedCount ?? 0
						}
					})
				}
			}

			this.links.forEach(link => this.updateLinkRate(link))
			this.items.forEach(item => this.updateItemMax(item.id))

			// Util maps

			this.itemMap = {}
			this.items.forEach(item => { this.itemMap[item.id] = item })

			this.prodMap = {}
			this.prods.forEach(prod => { this.prodMap[prod.id] = prod })

			this.itemInputMap = {}
			this.items.forEach(item => {
				this.itemInputMap[item.id] = new Map(item.inputs.map((input: any) => [input.id, input]))
			})

			// Offline gains

			if (this.lastSaveDate > 0) this.processOfflineProgress()
		},

		processOfflineProgress() {

			const now = Date.now()
			let offlineSeconds = Math.max(0, (now - this.lastSaveDate) / 1000)
			offlineSeconds = Math.min(offlineSeconds, 43200)

			if (offlineSeconds <= 0) return

			const tickSeconds = 2
			while (offlineSeconds > 0) {

				const currentTick = Math.min(offlineSeconds, tickSeconds)
				this.processGameTick(currentTick)
				offlineSeconds -= currentTick
			}
		},

		// Game tick

		togglePause() {

			this.isPaused = !this.isPaused
		},

		checkVictoryConditions() {

			if (!this.winConditions || this.hasWon) return

			let isVictorious = true
			
			for (const [id, condition] of Object.entries(this.winConditions))
				if (this.itemMap[id] && this.itemMap[id].count < condition) {
					isVictorious = false;
					break;
				}

			if (isVictorious && !this.hasWon) this.hasWon = true
		},

		processGameTick(deltaSeconds: number) {

			if (this.items.length === 0) return

			if (this.isPaused) return

			if (!this.hasWon) this.totalPlayTime += deltaSeconds

			// Manual crafting

			for (const manual of this.manuals) {
				
				if (!manual.isProcessing) continue

				if (!manual.queueCount || manual.queueCount <= 0) {
					manual.isProcessing = false
					manual.progressSeconds = 0
					continue
				}

				manual.progressSeconds -= deltaSeconds
				if (manual.progressSeconds <= 0) {

					const outputItem = this.itemMap[manual.output.id]
					if (outputItem) {
						outputItem.count += manual.output.count * manual.queueCount
						if (outputItem.count > outputItem.max) outputItem.count = outputItem.max
					}

					manual.isProcessing = false
					manual.progressSeconds = 0
					manual.queueCount = 0
				}
			}

			// Logistic links

			for (const link of this.links) {

				const countToTransfer = link.rate * deltaSeconds

				const sourceItem = this.itemMap[link.sourceItemId]
				if (!sourceItem || sourceItem.count < countToTransfer) continue

				const targetItem = this.itemMap[link.targetItemId]
				if (!targetItem) continue

				const targetItemInput = this.itemInputMap[link.targetItemId]?.get(link.sourceItemId)
				if (!targetItemInput) continue

				sourceItem.count -= countToTransfer
				if (sourceItem.count < 0) sourceItem.count = 0

				targetItemInput.count += countToTransfer
			}

			// Production lines

			for (const prod of this.prods) {
				
				// Waiting production lines

				if (!prod.isProcessing) {

					if (!prod.assignedCount || prod.assignedCount <= 0) continue

					let runMachineCount = prod.assignedCount

					for (const output of prod.outputs) {

						if (output.count <= 0) continue

						const outputItem = this.itemMap[output.id]

						const outputSpace = outputItem.max - outputItem.count
						const outputMachineCount = Math.floor(outputSpace / output.count)
						runMachineCount = Math.min(runMachineCount, outputMachineCount)

						for (const input of outputItem.inputs) {

							if (input.count <= 0) continue

							const prodInput = prod.inputs.find(i => i.id === input.id)

							const inputMachineCount = Math.floor(input.count / prodInput.count)
							runMachineCount = Math.min(runMachineCount, inputMachineCount)
						}
					}

					if (runMachineCount >= 1) {
						
						prod.runMachineCount = runMachineCount

						for (const output of prod.outputs) {

							const outputItem = this.itemMap[output.id]

							for (const input of outputItem.inputs) {

								const prodInput = prod.inputs.find(i => i.id === input.id)

								input.count -= prodInput * prod.runMachineCount
								if (input.count < 0) input.count = 0
							}
						}

						prod.isProcessing = true
						prod.progressSeconds = 0
					}
				}

				// Processing production lines

				if (prod.isProcessing) {

					prod.progressSeconds += deltaSeconds
					if (prod.progressSeconds >= prod.seconds) {

						let canDeliver = true

						for (const output of prod.outputs) {
							const outputItem = this.itemMap[output.id]
							if (!outputItem || outputItem.count >= outputItem.max) {
								canDeliver = false
								break
							}
						}

						if (canDeliver) {

							for (const output of prod.outputs) {
								const outputItem = this.itemMap[output.id]
								if (outputItem) {
									outputItem.count += output.count * prod.runMachineCount
									if (outputItem.count > outputItem.max) outputItem.count = outputItem.max
								}
							}

							prod.isProcessing = false
							prod.progressSeconds = 0
							prod.runMachineCount = 0
						}							
						else {

							prod.progressSeconds = prod.seconds
						}
					}
				}
			}

			// Check victory conditions

			this.checkVictoryConditions()
		},

		// Manual actions

		canStartManual(manual: any, count: number): boolean {

			if (!Number.isInteger(count) || count <= 0 || manual.isProcessing) return false

			for (const input of manual.inputs) {

				if (input.count <= 0) continue

				const inputItem = this.itemMap[input.id]
				if (!inputItem || inputItem.count < input.count * count) return false
			}

			const outputItem = this.itemMap[manual.output.id]
			if (!outputItem || (outputItem.max - outputItem.count) < (manual.output.count * count)) return false

			return true
		},

		startManual(manual: any, count: number): boolean {

			if (!this.canStartManual(manual, count)) return false

			for (const input of manual.inputs) {

				if (input.count <= 0) continue

				const inputItem = this.itemMap[input.id]
				inputItem.count -= input.count * count
			}

			manual.queueCount = count
			manual.isProcessing = true
			manual.progressSeconds = manual.seconds * count

			return true
		},

		cancelManual(manual: any): void {

			for (const input of manual.inputs) {

				if (input.count <= 0) continue

				const inputItem = this.itemMap[input.id]
				inputItem.count += input.count * manual.queueCount
			}

			manual.queueCount = 0
			manual.isProcessing = false
			manual.progressSeconds = 0
		},

		// Link actions

		updateLinkRate(link: any): void {

			const conveyor = this.items.find(candidate => candidate.id === link.conveyorId)
			if (!conveyor) return

			link.rate = link.assignedCount * conveyor.speed
		},

		assignLinkConveyor(link: any, count: number): boolean {

			if (this.itemAvailableCounts[link.conveyorId] < count) return false

			link.assignedCount += count
			this.updateLinkRate(link)
			return true
		},

		unassignLinkConveyor(link: any, count: number): boolean {

			if (link.assignedCount < count) return false

			link.assignedCount -= count
			this.updateLinkRate(link)
			return true
		},

		// Storage actions

		updateItemMax(itemId: string): void {

			const item = this.items.find(candidate => candidate.id === itemId)
			if (!item) return

			const addedCapacity = this.storages.reduce((total, storage) =>
				storage.itemId === itemId ? total + storage.assignedCount * storage.capacity : total, 0)

			item.max = Number.isFinite(item.stack)
				? item.stack + addedCapacity
				: item.stack
		},

		assignStorageStorer(storage: any, count: number): boolean {

			if (this.itemAvailableCounts[storage.storerId] < count) return false

			storage.assignedCount += count
			this.updateItemMax(storage.itemId)
			return true
		},

		unassignStorageStorer(storage: any, count: number): boolean {

			if (storage.assignedCount < count) return false

			storage.assignedCount -= count
			this.updateItemMax(storage.itemId)
			return true
		},

		// Prod actions

		assignProdMachine(prod: any, count: number): boolean {

			if (this.itemAvailableCounts[prod.machineId] < count) return false

			prod.assignedCount += count
			return true
		},

		unassignProdMachine(prod: any, count: number): boolean {

			if (prod.assignedCount < count) return false

			prod.assignedCount -= count
			return true
		},
	}
})