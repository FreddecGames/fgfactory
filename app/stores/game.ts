// ./app/stores/game.ts

import { defineStore } from 'pinia'

const LOCAL_DATA_NAME = 'fgfactory_save'

const AVAILABLE_SCENARIOS = [

	{ id: "satisfactory", name: "scenarios.satisfactory" },
	{ id: "alchemy", name: "scenarios.alchemy" },
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
	prods: Prod[]
	manuals: Manual[]
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
		selectedMachine: null as Item,
		selectedMission: null as Item,

		isItemModalOpen: false,
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

		items: [] as Item[],
		links: [] as Link[],
		prods: [] as Prod[],
		manuals: [] as Manual[],
		storages: [] as Storage[],
		
		itemMap: {} as Record<string, Item>,
		linkMap: {} as Record<string, Link>,
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

		itemWarnings: (state) => {

			const warnings: Record<string, boolean> = {}

			for (const item of state.items) {

				if (item.prods.some(prod => state.prodWarnings[prod.id]) || item.outLinks.some(link => state.linkWarnings[link.id])) warnings[item.id] = true
				else warnings[item.id] = false
			}

			return warnings
		},

		prodWarnings: (state) => {

			const warnings: Record<string, boolean> = {}

			for (const prod of state.prods) {

				if (prod.assignedCount > 0 && !prod.isProcessing) warnings[prod.id] = true
				else warnings[prod.id] = false
			}

			return warnings
		},

		linkWarnings: (state) => {

			const warnings: Record<string, boolean> = {}

			for (const link of state.links) {

				if (link.assignedCount > 0 && !link.isProcessing) warnings[link.id] = true
				else warnings[link.id] = false
			}

			return warnings
		},
	},

	actions: {

		// UI Modales

		openItem(itemId: string) {

			this.selectedItem = this.items.find(i => i.id === itemId)

			this.isItemModalOpen = true
			this.isMachineModalOpen = false
			this.isMissionModalOpen = false
		},

		openMachine(machineId: string) {

			this.selectedMachine = this.items.find(i => i.id === machineId)

			this.isItemModalOpen = false
			this.isMachineModalOpen = true
			this.isMissionModalOpen = false
		},

		openMission(missionId: string) {

			this.selectedMission = this.items.find(i => i.id === missionId)

			this.isItemModalOpen = false
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
				this.items.push({

					id: itemData.id,
					name: 'item_' + itemData.id,
					type: itemData.type,
					group: itemData.group,
					stack: itemData.stack,
					requirement: itemData.requirement || {},

					max: 0,
					count: itemData.initialCount || 0,

					prods: [],
					manuals: [],
					inLinks: [],
					outLinks: [],
					storages: [],

					manualCounts: [ 1, 5, 10 ],
					manualSelectedCount: 1,
				})
			})

			this.itemMap = {}
			this.items.forEach(item => { this.itemMap[item.id] = item })

			// Manuals

			this.manuals = []

			let dataRecipes = this.scenarioRecipes.filter(dataRecipe => dataRecipe.machines.includes('manual'))
			if (dataRecipes.length > 0) {
				dataRecipes.forEach(dataRecipe => {

					const outputId = Object.keys(dataRecipe.output)[0]
					const outputCount = dataRecipe.output[outputId]

					let manualInputs: { id: string, count: number }[] | undefined = undefined;
					if (dataRecipe.inputs) manualInputs = Object.entries(dataRecipe.inputs).map(([id, count]) => ({ id, count }))

					const newManual: Manual = {

						id: `${outputId}_manual`,
						itemId: outputId,
						inputs: manualInputs,
						seconds: dataRecipe.seconds,
						outputCount: outputCount,

						isProcessing: false,
						processCount: 0,
						remainingSeconds: 0,
					}

					this.manuals.push(newManual)

					this.itemMap[outputId].manuals.push(newManual)
				})
			}

			// Storages

			this.storages = []

			let dataItems = this.scenarioItems.filter(dataItem => dataItem.storers && dataItem.storers.length > 0)
			if (dataItems.length > 0) {
				dataItems.forEach(dataItem => {					
					dataItem.storers.forEach((storerId: string) => {

						const dataStorer = this.scenarioItems.find(candidate => candidate.id === storerId)

						const newStorage: Storage = {

							id: `${dataItem.id}_${storerId}`,
							itemId: dataItem.id,
							storerId: dataStorer.id,
							capacity: dataStorer.speed * dataItem.stack,

							assignedCount: 0
						}

						this.storages.push(newStorage)

						this.itemMap[dataItem.id].storages.push(newStorage)
					})
				})
			}

			// Links

			this.links = []

			dataRecipes = this.scenarioRecipes.filter(dataRecipe => dataRecipe.machines.some(machineId => machineId !== 'manual'))
			if (dataRecipes.length > 0) {
				dataRecipes.forEach(dataRecipe => {

					const outputId = Object.keys(dataRecipe.output)[0]

					if (dataRecipe.inputs) {
						Object.keys(dataRecipe.inputs).forEach(inputId => {

							const dataInput = this.scenarioItems.find(candidate => candidate.id === inputId)
							dataInput?.conveyors?.forEach(conveyorId => {

								const dataConveyor = this.scenarioItems.find(candidate => candidate.id === conveyorId)

								const newLink: Link = {

									id: `${inputId}_${outputId}`,
									sourceId: inputId,
									targetId: outputId,
									conveyorId: dataConveyor.id,
									conveyorSpeed: dataConveyor.speed,

									max: 0,
									count: 0,
									isProcessing: false,
									assignedCount: 0,
								}

								if (!this.links.find(l => l.id === newLink.id)) this.links.push(newLink)

								if (!this.itemMap[outputId].inLinks.find(l => l.id === newLink.id)) this.itemMap[outputId].inLinks.push(newLink)
								if (!this.itemMap[inputId].outLinks.find(l => l.id === newLink.id)) this.itemMap[inputId].outLinks.push(newLink)
							})
						})
					}

					dataRecipe.machines.filter(machineId => machineId !== 'manual').forEach(machineId => {

						const dataMachine = this.scenarioItems.find(candidate => candidate.id === machineId)
						if (dataMachine?.energy) {
							Object.keys(dataMachine.energy).forEach(energyId => {

								const dataEnergy = this.scenarioItems.find(candidate => candidate.id === energyId)
								dataEnergy?.conveyors?.forEach(conveyorId => {

									const dataConveyor = this.scenarioItems.find(candidate => candidate.id === conveyorId)

									const newLink: Link = {

										id: `${energyId}_${outputId}`,
										sourceId: energyId,
										targetId: outputId,
										conveyorId: dataConveyor.id,
										conveyorSpeed: dataConveyor.speed,

										max: 0,
										count: 0,
										isProcessing: false,
										assignedCount: 0,
									}

									if (!this.links.find(l => l.id === newLink.id)) this.links.push(newLink)

									if (!this.itemMap[outputId].inLinks.find(l => l.id === newLink.id)) this.itemMap[outputId].inLinks.push(newLink)
									if (!this.itemMap[energyId].outLinks.find(l => l.id === newLink.id)) this.itemMap[energyId].outLinks.push(newLink)
								})
							})
						}
					})
				})
			}

			this.linkMap = {}
			this.links.forEach(link => { this.linkMap[link.id] = link })

			// Prods

			this.prods = []

			dataRecipes = this.scenarioRecipes.filter(dataRecipe => dataRecipe.machines && dataRecipe.machines.some(machineId => machineId !== 'manual'))
			if (dataRecipes.length > 0) {
				dataRecipes.forEach(dataRecipe => {

					const outputId = Object.keys(dataRecipe.output)[0]
					const outputCount = dataRecipe.output[outputId]

					dataRecipe.machines.filter(machineId => machineId !== 'manual').forEach(machineId => {

						const dataMachine = this.scenarioItems.find(candidate => candidate.id === machineId)
						const prodInputs = [
							...(dataRecipe.inputs ? Object.entries(dataRecipe.inputs).map(([id, count]) => ({ id, count })) : []),
							...(dataMachine.energy ? Object.entries(dataMachine.energy).map(([id, count]) => ({ id, count })) : []),
						]

						const newProd: Prod = {

							id: `${outputId}_${machineId}`,
							itemId: outputId,
							machineId: machineId,

							inputs: prodInputs.length > 0 ? prodInputs : undefined,
							seconds: dataRecipe.seconds / dataMachine.speed,
							outputCount: outputCount,
						
							isProcessing: false,
							assignedCount: 0,	
							runMachineCount: 0,
							remainingSeconds: 0,
						}

						this.prods.push(newProd)

						this.itemMap[outputId].prods.push(newProd)
					})
				})
			}

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

			this.items.forEach(item => this.updateItemMax(item.id))
			this.links.forEach(link => this.updateLinkMax(link.id))

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

			return true
		},

		unassignLinkConveyor(link: Link, count: number): boolean {

			if (link.assignedCount < count) return false

			link.assignedCount -= count

			return true
		},

		// Storage actions

		assignStorageStorer(storage: Storage, count: number): boolean {

			if (this.itemAvailableCounts[storage.storerId] < count) return false

			storage.assignedCount += count
			this.updateItemMax(storage.itemId)
			return true
		},

		unassignStorageStorer(storage: Storage, count: number): boolean {

			if (storage.assignedCount < count) return false

			storage.assignedCount -= count
			this.updateItemMax(storage.itemId)
			return true
		},

		// Prod actions

		assignProdMachine(prod: Prod, count: number): boolean {

			if (!Number.isInteger(count) || count <= 0) return false
			if (this.itemAvailableCounts[prod.machineId] < count) return false

			prod.assignedCount += count

			this.itemMap[prod.itemId].inLinks.forEach(l => { this.updateLinkMax(l.id) });

			return true
		},

		unassignProdMachine(prod: Prod, count: number): boolean {

			if (!Number.isInteger(count) || count <= 0) return false
			if (prod.assignedCount < count) return false

			prod.assignedCount -= count

			this.itemMap[prod.itemId].inLinks.forEach(l => { this.updateLinkMax(l.id) });

			return true
		},
	}
})