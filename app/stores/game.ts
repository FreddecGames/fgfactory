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
		storers: [] as any[],
		machines: [] as any[],
		missions: [] as any[],
		conveyors: [] as any[],

		links: [] as any[],
		prods: [] as any[],
		manuals: [] as any[],
		storages: [] as any[],
		
		itemMap: {} as Record<string, any>,
		prodMap: {} as Record<string, any>,
		prodInputMap: {} as Record<string, Map<string, any>>,
	}),

	getters: {

		scenarios: () => AVAILABLE_SCENARIOS
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
					count: i.count
				})),

				links: this.links.map((link: any) => ({
					sourceItemId: link.sourceItemId,
					targetProdId: link.targetProdId,
					targetProdInputId: link.targetProdInputId,
					assignedCount: link.assignedCount || 0,
					rate: link.rate || 0,
					conveyorAssignments: link.conveyorAssignments.map((assignment: any) => ({
						conveyorId: assignment.conveyorId,
						assignedCount: assignment.assignedCount || 0,
					}))
				})),

				storers: this.storers.map(s => ({
					id: s.id,
					count: s.count
				})),

				machines: this.machines.map(m => ({
					id: m.id,
					count: m.count
				})),

				missions: this.missions.map(m => ({
					id: m.id,
					count: m.count
				})),

				conveyors: this.conveyors.map(c => ({
					id: c.id,
					count: c.count
				})),

				prods: this.prods.map(p => ({
					id: p.id, 
					assignedCount: p.assignedCount || 0,
					progressSeconds: p.progressSeconds || 0,
					isProcessing: p.isProcessing || false,
					runMachineCount: p.runMachineCount || 0,
					inputs: p.inputs.map((i: any) => ({ id: i.id, bufferCount: i.bufferCount || 0 }))
				})),

				manuals: this.manuals.map(m => ({
					id: m.id, 
					progressSeconds: m.progressSeconds || 0,
					isProcessing: m.isProcessing || false,
					queueCount: m.queueCount || 0
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
			this.storers = []
			this.machines = []
			this.missions = []
			this.conveyors = []

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
			this.storers = []
			this.machines = []
			this.missions = []
			this.conveyors = []

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
						group: itemData.group,
						baseMax: itemData.stack || Infinity,
						max: itemData.stack || Infinity,
						count: itemData.initialCount || 0,
						storers: itemData.storers || [],
						conveyors: itemData.conveyors || [],
					})
				})
			}

			// Storers

			this.storers = []
			this.storages = []

			if (scenarioData && scenarioData.storers) {

				scenarioData.storers.forEach((storerData: any) => {
					this.storers.push({
						id: storerData.id,
						img: `/scenarios/${this.currentScenarioId}/img/${storerData.id}.png`,
						name: 'storer_' + storerData.id,
						group: storerData.group,
						count: storerData.initialCount || 0,
					})
				})

				this.items.forEach(item => {
					if (item.storers.length > 0) {
						item.storers.forEach((storerId: string) => {
							if (!this.storers.some(storer => storer.id === storerId)) return

							this.storages.push({
								id: `${item.id}_${storerId}`,
								itemId: item.id,
								storerId: storerId,
								assignedCount: 0
							})
						})
					}
				})
			}

			// Machines

			this.machines = []
			if (scenarioData && scenarioData.machines) {
				scenarioData.machines.forEach((machineData: any) => {
					this.machines.push({
						id: machineData.id,
						img: `/scenarios/${this.currentScenarioId}/img/${machineData.id}.png`,
						name: 'machine_' + machineData.id,
						group: machineData.group,
						count: machineData.initialCount || 0,
					})
				})
			}

			// Missions

			this.missions = []
			if (scenarioData && scenarioData.missions) {
				scenarioData.missions.forEach((missionData: any) => {
					this.missions.push({
						id: missionData.id,
						img: `/scenarios/${this.currentScenarioId}/img/${missionData.id}.png`,
						name: 'mission_' + missionData.id,
						group: missionData.group,
						count: missionData.initialCount || 0,
					})
				})
			}

			// Conveyors

			this.conveyors = []
			if (scenarioData && scenarioData.conveyors) {
				scenarioData.conveyors.forEach((conveyorData: any) => {
					this.conveyors.push({
						id: conveyorData.id,
						img: `/scenarios/${this.currentScenarioId}/img/${conveyorData.id}.png`,
						name: 'conveyor_' + conveyorData.id,
						group: conveyorData.group,
						count: conveyorData.initialCount || 0,
						speed: conveyorData.speed || 0,
					})
				})
			}

			// Recipes

			this.links = []
			this.prods = []
			this.manuals = []

			if (scenarioData && scenarioData.recipes) {
				scenarioData.recipes.forEach((recipeData: any) => {
					
					const recipeInputs = [] as any[]
					if (recipeData.inputs) {
						Object.entries(recipeData.inputs).forEach(([inputId, inputRate]: [string, any]) => {
							
							const inputItem = this.items.find(i => i.id === inputId)
							const inputMax = inputItem ? inputItem.max : 100

							recipeInputs.push({ 
								id: inputId, 
								rate: inputRate, 
								bufferMax: inputMax
							})
						})
					}

					const recipeOutputs = [] as any[]
					if (recipeData.outputs) {
						Object.entries(recipeData.outputs).forEach(([outputId, outputRate]: [string, any]) => {
							recipeOutputs.push({ id: outputId, rate: outputRate })
						})
					}

					const compatibleMachineIds = recipeData.machines || []

					compatibleMachineIds.forEach((machineId: string) => {

						if (machineId === 'manual') {

							const uniqueManualId = `${recipeData.id}_manual`

							this.manuals.push({
								id: uniqueManualId,
								recipeId: recipeData.id,
								group: recipeData.group,
								durationSeconds: recipeData.seconds,
								progressSeconds: 0,
								isProcessing: false,
								queueCount: 0,
								outputs: recipeOutputs,
								inputs: recipeInputs,
							})
						}
						else {

							let machineSpeed = 1
							const machineConfig = this.machines.find(m => m.id === machineId)
							if (machineConfig && machineConfig.speed !== undefined)
								machineSpeed = machineConfig.speed

							const adjustedDuration = (recipeData.seconds || 1) / machineSpeed

							const lineInputs = recipeInputs.map(input => ({
								...input,
								bufferCount: 0
							}))

							const uniqueLineId = `${recipeData.id}_${machineId}`

							lineInputs.forEach((input: any) => {
								if (this.items.some(item => item.id === input.id)) {
									const sourceItem = this.items.find(item => item.id === input.id)
									this.links.push({
										sourceItemId: input.id,
										targetProdId: uniqueLineId,
										targetProdInputId: input.id,
										assignedCount: 0,
										rate: 0,
										conveyorAssignments: (sourceItem?.conveyors || [])
											.filter((conveyorId: string) => this.conveyors.some(conveyor => conveyor.id === conveyorId))
											.map((conveyorId: string) => ({ conveyorId, assignedCount: 0 })),
									})
								}
							})

							this.prods.push({

								id: uniqueLineId,                  
								recipeId: recipeData.id,            
								machineId: machineId,              
								group: recipeData.group,            
								assignedCount: 0,
								
								durationSeconds: adjustedDuration, 
								progressSeconds: 0,
								isProcessing: false,
								runMachineCount: 0,

								outputs: recipeOutputs,
								inputs: lineInputs
							})
						}
					})
				})
			}

			// Saved data

			if (decryptedLocalData) {
			
				if (decryptedLocalData.totalPlayTime !== undefined) this.totalPlayTime = decryptedLocalData.totalPlayTime

				if (decryptedLocalData.isPaused !== undefined) this.isPaused = decryptedLocalData.isPaused

				if (decryptedLocalData.hasWon !== undefined) this.hasWon = decryptedLocalData.hasWon

				if (decryptedLocalData.lastSaveDate !== undefined) this.lastSaveDate = decryptedLocalData.lastSaveDate

				if (decryptedLocalData.conveyors) {
					decryptedLocalData.conveyors.forEach((savedConveyor: any) => {
						const conveyor = this.conveyors.find(c => c.id === savedConveyor.id)
						if (conveyor) conveyor.count = savedConveyor.count ?? 0
					})
				}

				if (decryptedLocalData.links) {
					decryptedLocalData.links.forEach((savedLink: any) => {
						const link = this.links.find((candidate: any) =>
							candidate.sourceItemId === savedLink.sourceItemId &&
							candidate.targetProdId === savedLink.targetProdId &&
							candidate.targetProdInputId === savedLink.targetProdInputId
						)
						if (link) {
							if (savedLink.conveyorAssignments) {
								savedLink.conveyorAssignments.forEach((savedAssignment: any) => {
									const assignment = link.conveyorAssignments.find(
										(candidate: any) => candidate.conveyorId === savedAssignment.conveyorId
									)
									if (!assignment) return

									const requestedCount = Math.max(0, Math.floor(savedAssignment.assignedCount ?? 0))
									assignment.assignedCount = Math.min(
										requestedCount,
										this.getAvailableConveyorCount(assignment.conveyorId)
									)
								})
							}

							this.updateLinkConveyorRate(link)
						}
					})
				}

				if (decryptedLocalData.items) {
					decryptedLocalData.items.forEach((savedItem: any) => {
						const item = this.items.find(i => i.id === savedItem.id)
						if (item) item.count = savedItem.count ?? 0
					})
				}

				if (decryptedLocalData.machines) {
					decryptedLocalData.machines.forEach((savedMachine: any) => {
						const machine = this.machines.find(m => m.id === savedMachine.id)
						if (machine) machine.count = savedMachine.count ?? 0
					})
				}

				if (decryptedLocalData.prods) {
					decryptedLocalData.prods.forEach((savedProd: any) => {
						const prod = this.prods.find(p => p.id === savedProd.id)
						if (prod) {

							const requestedCount = Math.max(0, Math.floor(savedProd.assignedCount ?? 0))
							prod.assignedCount = Math.min(requestedCount, this.getAvailableMachineCount(prod.machineId))
							prod.progressSeconds = savedProd.progressSeconds ?? 0
							prod.isProcessing = savedProd.isProcessing || false
							prod.runMachineCount = savedProd.runMachineCount ?? 0

							if (savedProd.inputs) {
								savedProd.inputs.forEach((savedInput: any) => {
									const runtimeInput = prod.inputs.find((i: any) => i.id === savedInput.id)
									if (runtimeInput) runtimeInput.bufferCount = savedInput.bufferCount ?? 0
								})
							}
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

				if (decryptedLocalData.storers) {
					decryptedLocalData.storers.forEach((savedStorer: any) => {
						const storer = this.storers.find(s => s.id === savedStorer.id)
						if (storer) storer.count = savedStorer.count ?? 0
					})
				}

				if (decryptedLocalData.storages) {
					decryptedLocalData.storages.forEach((savedStorage: any) => {
						const storage = this.storages.find(s => s.id === savedStorage.id)
						if (storage) {
							const requestedCount = Math.max(0, Math.floor(savedStorage.assignedCount ?? 0))
							storage.assignedCount = Math.min(requestedCount, this.getAvailableStorerCount(storage.storerId))
						}
					})
				}
			}

			this.items.forEach(item => this.updateItemStorageCapacity(item.id))

			// Util maps

			this.itemMap = {}
			this.items.forEach(item => { this.itemMap[item.id] = item })

			this.prodMap = {}
			this.prods.forEach(prod => { this.prodMap[prod.id] = prod })

			this.prodInputMap = {}
			this.prods.forEach(prod => { this.prodInputMap[prod.id] = new Map(prod.inputs.map((input: any) => [input.id, input])) })

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

				manual.progressSeconds += deltaSeconds
				if (manual.progressSeconds >= (manual.durationSeconds * manual.queueCount)) {

					manual.outputs.forEach((output: any) => {
						const outputItem = this.itemMap[output.id]
						if (outputItem) {
							outputItem.count += output.rate * manual.queueCount
							if (outputItem.count > outputItem.max) outputItem.count = outputItem.max
						}
					})

					manual.isProcessing = false
					manual.progressSeconds = 0
					manual.queueCount = 0
				}
			}

			// Logistic links

			for (const link of this.links) {

				const item = this.itemMap[link.sourceItemId]
				if (!item || item.count <= 0) continue

				const targetProd = this.prodMap[link.targetProdId]
				if (!targetProd) continue

				const targetProdInputMap = this.prodInputMap[link.targetProdId]
				const targetProdInput = targetProdInputMap ? targetProdInputMap.get(link.targetProdInputId) : undefined
				if (!targetProdInput) continue

				const targetProdInputSpace = targetProdInput.bufferMax - targetProdInput.bufferCount
				if (targetProdInputSpace <= 0) continue

				const maxToTransfer = link.rate * deltaSeconds
				const countToTransfer = Math.min(maxToTransfer, item.count, targetProdInputSpace)

				if (countToTransfer > 0) {

					item.count -= countToTransfer
					if (item.count < 0) item.count = 0

					targetProdInput.bufferCount += countToTransfer
				}
			}

			// Production lines

			for (const prod of this.prods) {
				
				// Waiting production lines

				if (!prod.isProcessing) {

					if (!prod.assignedCount || prod.assignedCount <= 0) continue

					let runMachineCount = prod.assignedCount

					for (const input of prod.inputs) {
						if (input.rate <= 0) continue

						const inputMachineCount = Math.floor(input.bufferCount / input.rate)
						runMachineCount = Math.min(runMachineCount, inputMachineCount)
					}

					for (const output of prod.outputs) {
						if (output.rate <= 0) continue

						const outputItem = this.itemMap[output.id]
						if (!outputItem) {
							runMachineCount = 0
							continue
						}

						const outputSpace = outputItem.max - outputItem.count
						const outputMachineCount = Math.floor(outputSpace / output.rate)
						runMachineCount = Math.min(runMachineCount, outputMachineCount)
					}

					if (runMachineCount >= 1) {
						
						prod.runMachineCount = runMachineCount

						for (const input of prod.inputs) {
							input.bufferCount -= input.rate * prod.runMachineCount
							if (input.bufferCount < 0) input.bufferCount = 0
						}

						prod.isProcessing = true
						prod.progressSeconds = 0
					}
				}

				// Processing production lines

				if (prod.isProcessing) {

					prod.progressSeconds += deltaSeconds
					if (prod.progressSeconds >= prod.durationSeconds) {

						let canDeliver = true

						for (const output of prod.outputs) {
							const outputItem = this.itemMap[output.id]
							if (!outputItem || (outputItem.max - outputItem.count) < (output.rate * prod.runMachineCount)) {
								canDeliver = false
								break
							}
						}

						if (canDeliver) {

							for (const output of prod.outputs) {
								const outputItem = this.itemMap[output.id]
								if (outputItem) {
									outputItem.count += output.rate * prod.runMachineCount
									if (outputItem.count > outputItem.max) outputItem.count = outputItem.max
								}
							}

							prod.isProcessing = false
							prod.progressSeconds = 0
							prod.runMachineCount = 0
						}							
						else {

							prod.progressSeconds = prod.durationSeconds
						}
					}
				}
			}

			// Check victory conditions

			this.checkVictoryConditions()
		},

		// Manual crafting actions

		canStartManual(manual: any, count: number): boolean {

			let result = true

			for (const input of manual.inputs) {
				if (input.rate <= 0) continue

				const inputItem = this.itemMap[input.id]
				if (inputItem.count < input.rate * count) {
					result = false
					break
				}
			}

			for (const output of manual.outputs) {
				if (output.rate <= 0) continue

				const outputItem = this.itemMap[output.id]
				if (!outputItem || (outputItem.max - outputItem.count) < (output.rate * count)) {
					result = false
					break
				}
			}

			return result
		},

		startManual(manual: any, count: number): void {

			for (const input of manual.inputs) {
				if (input.rate <= 0) continue

				const inputItem = this.itemMap[input.id]
				inputItem.count -= input.rate * count
			}

			manual.queueCount = count
			manual.isProcessing = true
			manual.progressSeconds = 0
		},

		cancelManual(manual: any): void {

			for (const input of manual.inputs) {
				if (input.rate <= 0) continue

				const inputItem = this.itemMap[input.id]
				inputItem.count += input.rate * manual.queueCount
			}

			manual.queueCount = 0
			manual.isProcessing = false
			manual.progressSeconds = 0
		},

		getAvailableConveyorCount(conveyorId: string): number {

			const conveyor = this.conveyors.find(candidate => candidate.id === conveyorId)
			if (!conveyor) return 0

			const assignedCount = this.links.reduce((total, link) =>
				total + link.conveyorAssignments.reduce((linkTotal: number, assignment: any) =>
					assignment.conveyorId === conveyorId ? linkTotal + assignment.assignedCount : linkTotal, 0), 0)

			return Math.max(0, conveyor.count - assignedCount)
		},

		updateLinkConveyorRate(link: any): void {

			let rate = 0
			let assignedCount = 0

			for (const assignment of link.conveyorAssignments) {
				const conveyor = this.conveyors.find(candidate => candidate.id === assignment.conveyorId)
				if (!conveyor) continue

				assignedCount += assignment.assignedCount
				rate += assignment.assignedCount * conveyor.speed
			}

			link.assignedCount = assignedCount
			link.rate = rate
		},

		assignLinkConveyor(link: any, assignment: any): boolean {

			if (this.getAvailableConveyorCount(assignment.conveyorId) <= 0) return false

			assignment.assignedCount += 1
			this.updateLinkConveyorRate(link)
			return true
		},

		unassignLinkConveyor(link: any, assignment: any): boolean {

			if (assignment.assignedCount <= 0) return false

			assignment.assignedCount -= 1
			this.updateLinkConveyorRate(link)
			return true
		},

		getAvailableStorerCount(storerId: string): number {

			const storer = this.storers.find(candidate => candidate.id === storerId)
			if (!storer) return 0

			const assignedCount = this.storages.reduce((total, storage) =>
				storage.storerId === storerId ? total + storage.assignedCount : total, 0)

			return Math.max(0, storer.count - assignedCount)
		},

		updateItemStorageCapacity(itemId: string): void {

			const item = this.items.find(candidate => candidate.id === itemId)
			if (!item) return

			const assignedCount = this.storages.reduce((total, storage) =>
				storage.itemId === itemId ? total + storage.assignedCount : total, 0)

			item.max = Number.isFinite(item.baseMax)
				? item.baseMax * (1 + assignedCount)
				: item.baseMax
		},

		assignStorageStorer(storage: any): boolean {

			if (this.getAvailableStorerCount(storage.storerId) <= 0) return false

			storage.assignedCount += 1
			this.updateItemStorageCapacity(storage.itemId)
			return true
		},

		unassignStorageStorer(storage: any): boolean {

			if (storage.assignedCount <= 0) return false

			storage.assignedCount -= 1
			this.updateItemStorageCapacity(storage.itemId)
			return true
		},

		getAvailableMachineCount(machineId: string): number {

			const machine = this.machines.find(candidate => candidate.id === machineId)
			if (!machine) return 0

			const assignedCount = this.prods.reduce((total, prod) =>
				prod.machineId === machineId ? total + prod.assignedCount : total, 0)

			return Math.max(0, machine.count - assignedCount)
		},

		assignProductionMachine(prod: any): boolean {

			if (this.getAvailableMachineCount(prod.machineId) <= 0) return false

			prod.assignedCount += 1
			return true
		},

		unassignProductionMachine(prod: any): boolean {

			if (prod.assignedCount <= 0) return false

			prod.assignedCount -= 1
			return true
		},
	}
})