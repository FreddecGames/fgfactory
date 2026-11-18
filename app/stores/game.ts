// ./app/stores/game.ts

import { defineStore } from 'pinia'

const LOCAL_DATA_NAME = 'fgfactory_save'

const AVAILABLE_SCENARIOS = [

	{ id: "satisfactory", name: "scenarios.satisfactory" },
	{ id: "techtonica", name: "scenarios.techtonica" },
]

interface Victory {
	scenarioId: string
	totalPlayTime: number
	date: string
}

interface ScenarioItem {
	id: string
	type: 'mission' | 'item' | 'machine' | 'storer' | 'conveyor'
	group: string
	stack: number
	requirement?: Record<string, number>
	storers?: string[]
	conveyors?: string[]
	energy?: Record<string, number>
	speed?: number
}

interface ScenarioRecipe {
	id: string
	seconds: number
	output: Record<string, number>
	inputs?: Record<string, number>
	machines: string[]
}

interface Item {
	id: string
	name: string
	type: string
	group: string
	stack: number
	requirement?: Record<string, number>
	max: number
	count: number
	manual: Manual
	prods: Prod[]
	inLinks: Link[]
	outLinks: Link[]
	storages: Storage[]
	manualCounts: number[]
	manualSelectedCount: number
}

interface Link {
	id: string
	sourceId: string
	targetId: string
	conveyorId: string
	conveyorSpeed: number
	max: number
	count: number
	isProcessing: boolean
	assignedCount: number
}

interface Prod {
	id: string
	itemId: string
	machineId: string
	inputs?: { id: string, count: number }[]
	seconds: number
	outputCount: number
	isProcessing: boolean
	assignedCount: number	
	runMachineCount: number
	remainingSeconds: number
}

interface Manual {
	id: string
	itemId: string
	seconds: number
	outputCount: number
	inputs?: { id: string, count: number }[]
	isProcessing: boolean
	processCount: number
	remainingSeconds: number
}

interface Storage {
	id: string
	itemId: string
	storerId: string
	capacity: number
	assignedCount: number
}

export const useGameStore = defineStore('game', {

	state: () => ({

		selectedItem: null as Item,
		selectedLocked: null as Item,
		selectedMachine: null as Item,
		selectedMission: null as Item,

		isItemModalOpen: false,
		isLockedModalOpen: false,
		isMachineModalOpen: false,
		isMissionModalOpen: false,

		lastSaveDate: 0,
		saveIntervalId: null as ReturnType<typeof setInterval> | null,
		isRefreshing: false,

		customGameName : null as string | null,
		
		victories: [] as Victory[],

		currentScenarioId: AVAILABLE_SCENARIOS[0]?.id as string | null,
		totalPlayTime: 0,
		isPaused: false,
		hasWon: false,

		scenarioItems: [] as ScenarioItem[],
		scenarioRecipes: [] as ScenarioRecipe[],
		scenarioWinConditions: null as Record<string, number> | null,

		unlockedItemIds: [] as string[],

		items: [] as Item[],
		links: [] as Link[],
		prods: [] as Prod[],
		manuals: [] as Manual[],
		storages: [] as Storage[],
		
		itemMap: {} as Record<string, Item>,
		linkMap: {} as Record<string, Link>,
		
		itemAvailableCounts: {} as Record<string, number>,
	}),

	getters: {

		scenarios: () => AVAILABLE_SCENARIOS,

		itemProductionRates: (state) => {

			const rates: Record<string, number> = {}

			for (const item of state.items)
				rates[item.id] = 0

			for (const prod of state.prods)
				rates[prod.itemId] += prod.outputCount * prod.assignedCount / prod.seconds

			for (const link of state.links)
				rates[link.sourceId] -= link.conveyorSpeed * link.assignedCount

			return rates
		},

		itemImgs: (state) => {

			const imgs: Record<string, string> = {}

			for (const item of state.items)
				imgs[item.id] = `/scenarios/${state.currentScenarioId}/img/${item.id}.png`

			return imgs
		},

		itemCounts: (state) => {

			const counts: Record<string, number> = {}

			for (const item of state.items)
				counts[item.id] = item.count

			return counts
		},

		itemUnlockeds: (state) => {

			const unlockeds: Record<string, boolean> = {}

			for (const item of state.items)
				unlockeds[item.id] = state.unlockedItemIds.includes(item.id)


			return unlockeds
		},


		itemWarnings: (state) => {

			const warnings: Record<string, boolean> = {}

			for (const item of state.items) {

				warnings[item.id] = false

				item.inLinks.forEach(link => {

					if (link.assignedCount * link.conveyorSpeed < state.linkMiniumRates[link.id]) {
						warnings[item.id] = true
						return
					}
				})

				item.outLinks.forEach(link => {

					if (link.assignedCount * link.conveyorSpeed < state.linkMiniumRates[link.id]) {
						warnings[item.id] = true
						return
					}
				})
			}

			return warnings
		},


		linkUnlockeds: (state) => {

			const unlockeds: Record<string, boolean> = {}

			for (const link of state.links) {

				unlockeds[link.id] = true

				if (!state.unlockedItemIds.includes(link.conveyorId) || !state.unlockedItemIds.includes(link.sourceId) || !state.unlockedItemIds.includes(link.targetId))
					unlockeds[link.id] = false;
			}

			return unlockeds
		},

		linkMiniumRates: (state) => {

			const rates: Record<string, number> = {}

			for (const link of state.links) {

				let rate = 0

				const targetItem = state.itemMap[link.targetId]
				targetItem?.prods.forEach(prod => {

					const recipeInput = prod.inputs?.find(i => i.id === link.sourceId)
					if (recipeInput)
						rate += prod.assignedCount * recipeInput.count / prod.seconds
				})

				rates[link.id] = rate
			}

			return rates
		},
	},

	actions: {

		// UI Modales

		openLocked(itemId: string) {

			this.selectedLocked = this.items.find(i => i.id === itemId)

			this.isItemModalOpen = false
			this.isLockedModalOpen = true
			this.isMachineModalOpen = false
			this.isMissionModalOpen = false
		},

		openItem(itemId: string) {

			if (!this.itemUnlockeds[itemId]) return this.openLocked(itemId)

			this.selectedItem = this.items.find(i => i.id === itemId)

			this.isItemModalOpen = true
			this.isLockedModalOpen = false
			this.isMachineModalOpen = false
			this.isMissionModalOpen = false
		},

		openMachine(machineId: string) {

			if (!this.itemUnlockeds[machineId]) return this.openLocked(machineId)

			this.selectedMachine = this.items.find(i => i.id === machineId)

			this.isItemModalOpen = false
			this.isLockedModalOpen = false
			this.isMachineModalOpen = true
			this.isMissionModalOpen = false
		},

		openMission(missionId: string) {

			if (!this.itemUnlockeds[missionId]) return this.openLocked(missionId)

			this.selectedMission = this.items.find(i => i.id === missionId)

			this.isItemModalOpen = false
			this.isLockedModalOpen = false
			this.isMachineModalOpen = false
			this.isMissionModalOpen = true
		},

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

				currentScenarioId: this.currentScenarioId,

				hasWon: this.hasWon,
				isPaused: this.isPaused,
				lastSaveDate: this.lastSaveDate,
				totalPlayTime: this.totalPlayTime,
				customGameName: this.customGameName,

				victories: this.victories.map(v => ({
					scenarioId: v.scenarioId,
					totalPlayTime: v.totalPlayTime,
					date: v.date,
				})),

				unlockedItemIds: this.unlockedItemIds,

				items: this.items.map(i => ({
					id: i.id,
					count: i.count,
					inputs: i.inputs ? i.inputs.map((input: any) => ({ id: input.id, count: input.count || 0, })) : null,
					manualSelectedCount: i.manualSelectedCount,
				})),

				links: this.links.map((link: any) => ({
					id: link.id,
					count: link.count || 0,
					assignedCount: link.assignedCount || 0,
				})),

				prods: this.prods.map(p => ({
					id: p.id, 
					assignedCount: p.assignedCount || 0,
					remainingSeconds: p.remainingSeconds || 0,
					isProcessing: p.isProcessing || false,
					runMachineCount: p.runMachineCount || 0,
				})),

				manuals: this.manuals.map(m => ({
					id: m.id, 
					remainingSeconds: m.remainingSeconds || 0,
					isProcessing: m.isProcessing || false,
					processCount: m.processCount || 0,
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

			this.scenarioWinConditions = null
			this.hasWon = false

			this.totalPlayTime = 0
			this.isPaused = false

			this.unlockedItemIds = []

			this.items = []
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

			this.scenarioWinConditions = null
			this.hasWon = false
			
			this.currentScenarioId = newScenarioId
			this.totalPlayTime = 0
			this.isPaused = false

			this.unlockedItemIds = []

			this.items = []
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
			
			// Victories

			if (decryptedLocalData && decryptedLocalData.victories && decryptedLocalData.victories.length > 0) {
				decryptedLocalData.victories.forEach(victory => {
					this.victories.push({

						scenarioId: victory.scenarioId,
						totalPlayTime: victory.totalPlayTime,
						date: victory.date,
					})
				})
			}

			// Scenario data

			if (decryptedLocalData && decryptedLocalData.currentScenarioId !== undefined)
				this.currentScenarioId = decryptedLocalData.currentScenarioId

			if (!AVAILABLE_SCENARIOS.some(s => s.id === this.currentScenarioId))
				this.currentScenarioId = AVAILABLE_SCENARIOS[0]?.id

			const [scenarioData] = await Promise.all([
				fetch(`/scenarios/${this.currentScenarioId}/data.json`).then(response => response.json())
			])

			this.scenarioWinConditions = scenarioData && scenarioData.winConditions ? scenarioData.winConditions : null	
			this.scenarioItems = scenarioData && scenarioData.items ? scenarioData.items : null	
			this.scenarioRecipes = scenarioData && scenarioData.recipes ? scenarioData.recipes : null	

			// Items

			this.items = []

			scenarioData.items.forEach((itemData: any) => {

				const newItem: Item = {

					id: itemData.id,
					name: 'item_' + itemData.id,
					type: itemData.type,
					group: itemData.group,
					stack: itemData.stack,
					requirement: itemData.requirement || {},

					max: 0,
					count: itemData.initialCount || 0,

					prods: [],
					inLinks: [],
					outLinks: [],
					storages: [],

					manualCounts: [ 1, 5, 10 ],
					manualSelectedCount: 1,
				}

				this.items.push(newItem)

				// Storages

				if (itemData.storers && itemData.storers.length > 0) {
					itemData.storers.forEach((storerId: string) => {

						const dataStorer = this.scenarioItems.find(candidate => candidate.id === storerId)

						const newStorage: Storage = {

							id: `${itemData.id}_${storerId}`,
							itemId: itemData.id,
							storerId: dataStorer.id,
							capacity: dataStorer.speed * itemData.stack,

							assignedCount: 0
						}

						this.storages.push(newStorage)

						newItem.storages.push(newStorage)
					})
				}
			})

			this.itemMap = {}
			this.items.forEach(item => { this.itemMap[item.id] = item })

			scenarioData.items.filter(i => i.recipe).forEach((itemData: any) => {

				// Input Links

				if (itemData.recipe.inputs && itemData.recipe.machines && itemData.recipe.machines.some(m => m !== 'manual')) {
					Object.keys(itemData.recipe.inputs).forEach(inputId => {

						const dataInput = this.scenarioItems.find(candidate => candidate.id === inputId)
						dataInput?.conveyors?.forEach(conveyorId => {

							const dataConveyor = this.scenarioItems.find(candidate => candidate.id === conveyorId)

							const newLink: Link = {

								id: `${inputId}_${itemData.id}`,
								sourceId: inputId,
								targetId: itemData.id,
								conveyorId: dataConveyor.id,
								conveyorSpeed: dataConveyor.speed,

								max: 0,
								count: 0,
								isProcessing: false,
								assignedCount: 0,
							}

							if (!this.links.find(l => l.id === newLink.id)) this.links.push(newLink)

							if (!this.itemMap[itemData.id].inLinks.find(l => l.id === newLink.id)) this.itemMap[itemData.id].inLinks.push(newLink)
							if (!this.itemMap[inputId].outLinks.find(l => l.id === newLink.id)) this.itemMap[inputId].outLinks.push(newLink)
						})
					})
				}

				if (itemData.recipe.machines && itemData.recipe.machines.length > 0) {
					itemData.recipe.machines.forEach(machineId => {

						// Manual

						if (machineId ==='manual') {

							let manualInputs: { id: string, count: number }[] | undefined = undefined;
							if (itemData.recipe.inputs) manualInputs = Object.entries(itemData.recipe.inputs).map(([id, count]) => ({ id, count }))

							const newManual: Manual = {

								id: `${itemData.id}_manual`,
								itemId: itemData.id,
								inputs: manualInputs,
								seconds: itemData.recipe.seconds ?? 0,
								outputCount: itemData.recipe.output,

								isProcessing: false,
								processCount: 0,
								remainingSeconds: 0,
							}

							this.manuals.push(newManual)

							this.itemMap[itemData.id].manual = newManual
						}
						else {

							// Energy Links

							const dataMachine = this.scenarioItems.find(candidate => candidate.id === machineId)
							if (dataMachine?.energy) {
								Object.keys(dataMachine.energy).forEach(energyId => {

									const dataEnergy = this.scenarioItems.find(candidate => candidate.id === energyId)
									dataEnergy?.conveyors?.forEach(conveyorId => {

										const dataConveyor = this.scenarioItems.find(candidate => candidate.id === conveyorId)

										const newLink: Link = {

											id: `${energyId}_${itemData.id}`,
											sourceId: energyId,
											targetId: itemData.id,
											conveyorId: dataConveyor.id,
											conveyorSpeed: dataConveyor.speed,

											max: 0,
											count: 0,
											isProcessing: false,
											assignedCount: 0,
										}

										if (!this.links.find(l => l.id === newLink.id)) this.links.push(newLink)

										if (!this.itemMap[itemData.id].inLinks.find(l => l.id === newLink.id)) this.itemMap[itemData.id].inLinks.push(newLink)
										if (!this.itemMap[energyId].outLinks.find(l => l.id === newLink.id)) this.itemMap[energyId].outLinks.push(newLink)
									})
								})
							}

							// Prods

							const outputCount = itemData.recipe.output

							itemData.recipe.machines.filter(machineId => machineId !== 'manual').forEach(machineId => {

								const dataMachine = this.scenarioItems.find(candidate => candidate.id === machineId)
								const prodInputs = [
									...(itemData.recipe.inputs ? Object.entries(itemData.recipe.inputs).map(([id, count]) => ({ id, count })) : []),
									...(dataMachine.energy ? Object.entries(dataMachine.energy).map(([id, count]) => ({ id, count })) : []),
								]

								const newProd: Prod = {

									id: `${itemData.id}_${machineId}`,
									itemId: itemData.id,
									machineId: machineId,

									inputs: prodInputs.length > 0 ? prodInputs : undefined,
									seconds: itemData.recipe.seconds / dataMachine.speed,
									outputCount: outputCount,
								
									isProcessing: false,
									assignedCount: 0,	
									runMachineCount: 0,
									remainingSeconds: 0,
								}

								this.prods.push(newProd)

								this.itemMap[itemData.id].prods.push(newProd)
							})
						}
					})
				}
			})

			this.linkMap = {}
			this.links.forEach(link => { this.linkMap[link.id] = link })

			// Saved data

			if (decryptedLocalData) {
			
				if (decryptedLocalData.hasWon !== undefined) this.hasWon = decryptedLocalData.hasWon
				if (decryptedLocalData.isPaused !== undefined) this.isPaused = decryptedLocalData.isPaused
				if (decryptedLocalData.lastSaveDate !== undefined) this.lastSaveDate = decryptedLocalData.lastSaveDate
				if (decryptedLocalData.totalPlayTime !== undefined) this.totalPlayTime = decryptedLocalData.totalPlayTime
				if (decryptedLocalData.customGameName !== undefined) this.customGameName = decryptedLocalData.customGameName

				if (decryptedLocalData.items) {
					decryptedLocalData.items.forEach((savedItem: any) => {

						const item = this.items.find(i => i.id === savedItem.id)
						if (item) {

							item.count = savedItem.count ?? 0
							item.manualSelectedCount = savedItem.manualSelectedCount ?? item.manualCounts[0]
						}
					})
				}
				
				if (Array.isArray(decryptedLocalData.unlockedItemIds)) {
					this.unlockedItemIds = decryptedLocalData.unlockedItemIds.filter((id: unknown): id is string =>
						typeof id === 'string' && Boolean(this.itemMap[id]))
				}

				if (decryptedLocalData.links) {
					decryptedLocalData.links.forEach((savedLink: any) => {

						const link = this.links.find(l => l.id == savedLink.id)
						if (link) {

							link.count = savedLink.count ?? 0
							link.assignedCount = savedLink.assignedCount ?? 0
						}
					})
				}

				if (decryptedLocalData.prods) {
					decryptedLocalData.prods.forEach((savedProd: any) => {

						const prod = this.prods.find(l => l.id == savedProd.id)
						if (prod) {

							prod.isProcessing = savedProd.isProcessing || false
							prod.assignedCount = savedProd.assignedCount ?? 0
							prod.remainingSeconds = savedProd.remainingSeconds ?? 0
							prod.runMachineCount = savedProd.runMachineCount ?? 0
						}
					})
				}

				if (decryptedLocalData.manuals) {
					decryptedLocalData.manuals.forEach((savedManual: any) => {

						const manual = this.manuals.find(m => m.id === savedManual.id)
						if (manual) {

							manual.isProcessing = savedManual.isProcessing || false
							manual.processCount = savedManual.processCount ?? 0
							manual.remainingSeconds = savedManual.remainingSeconds ?? 0
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

			this.updateItemUnlocks()

			this.items.forEach(item => this.updateItemMax(item.id))
			this.links.forEach(link => this.updateLinkMax(link.id))

			this.recalculateItemAvailableCounts()

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

			if (!this.scenarioWinConditions || this.hasWon) return

			let isVictorious = true
			
			for (const [id, condition] of Object.entries(this.scenarioWinConditions))
				if (this.itemMap[id] && this.itemMap[id].count < condition) {
					isVictorious = false;
					break;
				}

			if (isVictorious && !this.hasWon) {

				this.hasWon = true

				this.victories.push({

					scenarioId: this.currentScenarioId,
					totalPlayTime: this.totalPlayTime,
					date: new Date().toLocaleString(),
				})
			}
		},

		processGameTick(deltaSeconds: number) {

			if (this.isPaused) return

			if (!this.hasWon) this.totalPlayTime += deltaSeconds

			// Manuals

			for (const manual of this.manuals) {
				
				if (!manual.isProcessing) continue

				manual.remainingSeconds -= deltaSeconds
				if (manual.remainingSeconds <= 0) {

					const outputItem = this.itemMap[manual.itemId]

					outputItem.count += manual.outputCount * manual.processCount
					if (outputItem.count > outputItem.max) outputItem.count = outputItem.max

					manual.isProcessing = false
					manual.processCount = 0
					manual.remainingSeconds = 0

					this.updateItemUnlocks()
				}
			}

			// Links

			for (const link of this.links) {

				let countToTransfer = link.conveyorSpeed * link.assignedCount * deltaSeconds
				countToTransfer = Math.min(countToTransfer, link.max - link.count)

				const sourceItem = this.itemMap[link.sourceId]
				if (sourceItem.count <= 0) continue
				countToTransfer = Math.min(countToTransfer, sourceItem.count)

				if (countToTransfer > 0) {

					link.isProcessing = true

					sourceItem.count -= countToTransfer
					if (sourceItem.count < 0) sourceItem.count = 0

					link.count += countToTransfer
					if (link.count > link.max) link.count = link.max

				}
				else link.isProcessing = false
			}

			// Prods

			for (const prod of this.prods) {
				
				// Waiting prod

				if (!prod.isProcessing) {

					if (!prod.assignedCount || prod.assignedCount <= 0) continue

					let runMachineCount = prod.assignedCount

					const outputItem = this.itemMap[prod.itemId]
					const outputMachineCount = Math.floor((outputItem.max - outputItem.count) / prod.outputCount)
					runMachineCount = Math.min(runMachineCount, outputMachineCount)

					if (prod.inputs) {
						for (const input of prod.inputs) {

							const inputLink = this.linkMap[`${input.id}_${prod.itemId}`]

							const inputMachineCount = Math.floor(inputLink.count / input.count)
							runMachineCount = Math.min(runMachineCount, inputMachineCount)
						}
					}

					if (runMachineCount >= 1) {

						if (prod.inputs) {
							for (const input of prod.inputs) {

								const inputLink = this.linkMap[`${input.id}_${prod.itemId}`]

								inputLink.count -= input.count * runMachineCount
								if (inputLink.count < 0) inputLink.count = 0
							}
						}
						
						prod.isProcessing = true
						prod.runMachineCount = runMachineCount
						prod.remainingSeconds = prod.seconds
					}
				}

				// Processing prod

				if (prod.isProcessing) {

					prod.remainingSeconds -= deltaSeconds
					if (prod.remainingSeconds <= 0) {

						let canDeliver = true

						const outputItem = this.itemMap[prod.itemId]
						if (outputItem.count >= outputItem.max) canDeliver = false

						if (canDeliver) {

							outputItem.count += prod.outputCount * prod.runMachineCount
							if (outputItem.count > outputItem.max) outputItem.count = outputItem.max

							prod.isProcessing = false
							prod.remainingSeconds = 0
							prod.runMachineCount = 0
						}							
						else {

							prod.remainingSeconds = prod.seconds
						}
					}
				}
			}

			// Check victory conditions

			this.checkVictoryConditions()
		},

		// Victory actions

		victoryDelete(index: number) {

			this.victories.splice(index, 1)
		},

		// Item actions

		updateItemMax(itemId: string): void {

			const item = this.items.find(candidate => candidate.id === itemId)
			if (!item) return

			const addedCapacity = this.storages.reduce((total, storage) =>
				storage.itemId === itemId ? total + storage.assignedCount * storage.capacity : total, 0)

			item.max = Number.isFinite(item.stack) ? item.stack + addedCapacity : item.stack
		},

		recalculateItemAvailableCounts(): void {

			const counts: Record<string, number> = {}

			for (const item of this.items) {

				if (item.type !== 'machine' && item.type !== 'storer' && item.type !== 'conveyor')
					continue

				let assignedCount = 0

				if (item.type === 'machine') {
					assignedCount = this.prods.reduce((total, prod) =>
						prod.machineId === item.id ? total + prod.assignedCount : total, 0)
				}
				else if (item.type === 'storer') {
					assignedCount = this.storages.reduce((total, storage) =>
						storage.storerId === item.id ? total + storage.assignedCount : total, 0)
				}
				else if (item.type === 'conveyor') {
					assignedCount = this.links.reduce((total, link) =>
						link.conveyorId === item.id ? total + link.assignedCount : total, 0)
				}

				counts[item.id] = Math.max(0, item.count - assignedCount)
			}

			this.itemAvailableCounts = counts
		},

		updateItemUnlocks(): void {

			const unlockedItemIds = new Set(this.unlockedItemIds)
			let hasNewUnlock = false

			for (const item of this.items) {

				const requirementsMet = Object.entries(item.requirement ?? {}).every(([id, count]) =>
					!this.itemMap[id] || this.itemMap[id].count >= count)

				if (requirementsMet && !unlockedItemIds.has(item.id)) {
					unlockedItemIds.add(item.id)
					hasNewUnlock = true
				}
			}

			if (hasNewUnlock) this.unlockedItemIds = [...unlockedItemIds]
		},

		// Manual actions

		canStartManual(manual: Manual, count: number): boolean {

			if (!Number.isInteger(count) || count <= 0 || manual.isProcessing) return false

			if (manual.inputs) {
				for (const input of manual.inputs) {

					if (input.count <= 0) continue

					const inputItem = this.itemMap[input.id]
					if (inputItem.count < input.count * count) return false
				}
			}

			const outputItem = this.itemMap[manual.itemId]
			if (outputItem.max - outputItem.count < manual.outputCount * count) return false

			return true
		},

		startManual(manual: Manual, count: number): boolean {

			if (!this.canStartManual(manual, count)) return false

			if (manual.inputs) {
				for (const input of manual.inputs) {

					if (input.count <= 0) continue

					const inputItem = this.itemMap[input.id]
					inputItem.count -= input.count * count
				}
			}

			manual.processCount = count
			manual.isProcessing = true
			manual.remainingSeconds = manual.seconds * count

			return true
		},

		cancelManual(manual: Manual): void {

			if (manual.inputs) {
				for (const input of manual.inputs) {

					if (input.count <= 0) continue

					const inputItem = this.itemMap[input.id]
					inputItem.count += input.count * manual.processCount
				}
			}

			manual.processCount = 0
			manual.isProcessing = false
			manual.remainingSeconds = 0
		},

		// Link actions

		updateLinkMax(linkId: string): void {

			const link = this.links.find(candidate => candidate.id === linkId)
			if (!link) return

			let max = 0

			const prods = this.prods.filter(p => p.itemId === link.targetId && p.assignedCount > 0)
			prods.forEach(prod => {

				const prodInput = prod.inputs.find(i => i.id === link.sourceId)
				if (prodInput) max += prod.assignedCount * prodInput.count
			})

			link.max = max
		},

		assignLinkConveyor(link: Link, count: number): boolean {

			if (this.itemAvailableCounts[link.conveyorId] < count) return false

			link.assignedCount += count
			this.recalculateItemAvailableCounts()

			return true
		},

		unassignLinkConveyor(link: Link, count: number): boolean {

			if (link.assignedCount < count) return false

			link.assignedCount -= count
			this.recalculateItemAvailableCounts()

			return true
		},

		// Storage actions

		assignStorageStorer(storage: Storage, count: number): boolean {

			if (this.itemAvailableCounts[storage.storerId] < count) return false

			storage.assignedCount += count
			this.updateItemMax(storage.itemId)
			this.recalculateItemAvailableCounts()
			return true
		},

		unassignStorageStorer(storage: Storage, count: number): boolean {

			if (storage.assignedCount < count) return false

			storage.assignedCount -= count
			this.updateItemMax(storage.itemId)
			this.recalculateItemAvailableCounts()
			return true
		},

		// Prod actions

		assignProdMachine(prod: Prod, count: number): boolean {

			if (!Number.isInteger(count) || count <= 0) return false
			if (this.itemAvailableCounts[prod.machineId] < count) return false

			prod.assignedCount += count
			this.recalculateItemAvailableCounts()

			this.itemMap[prod.itemId].inLinks.forEach(l => { this.updateLinkMax(l.id) });

			return true
		},

		unassignProdMachine(prod: Prod, count: number): boolean {

			if (!Number.isInteger(count) || count <= 0) return false
			if (prod.assignedCount < count) return false

			prod.assignedCount -= count
			this.recalculateItemAvailableCounts()

			this.itemMap[prod.itemId].inLinks.forEach(l => { this.updateLinkMax(l.id) });

			return true
		},
	}
})