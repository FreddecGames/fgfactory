import scenario_1 from '~/scenarios/scenario_1.js'

export const formatTime = function(value) {

    if (value == Infinity) return 'Infinity'

    if (value < 1) return Math.ceil(value * 1000) + ' ms'

    if (value > 31536000e3) return formatNumber(value / 31536000) + 'yr'

    if (value > 31536000) return Math.floor(value / 31536000) + 'yr ' + formatTime(value % 31536000)

    if (value > 86400) return Math.floor(value / 86400) + 'd ' + formatTime(value % 86400)

    let h = Math.floor(value / 3600)
    if (h < 10) { h = '0' + h }

    let m = Math.floor(value / 60) % 60
    if (m < 10) { m = '0' + m }

    let s = Math.floor(value % 60)
    if (s < 10) { s = '0' + s }

    let val = h + ':' + m + ':' + s                
    return val
}

class Elem {

    constructor(data) {

        let names = Object.getOwnPropertyNames(data) 
        names.forEach(name => { Object.defineProperty(this, name, Object.getOwnPropertyDescriptor(data, name)) })
		
		this.unlocked = this.reqs ? false : true
		
		if (data.type == 'mission') {

			this.count = this.count ? this.count : 0
			this.max = this.max ? this.max : Infinity
		}
		else if (data.type == 'tech') {

			this.count = this.count ? this.count : 0
			this.max = this.max ? this.max : Infinity
		}
		else if (data.type == 'item') {
			
			this.count = this.count ? this.count : 0
			this.max = this.stack ? this.stack : Infinity
		}
		else if (data.type == 'storer') {
			
			this.availableCount = this.count ? this.count : 0
			this.count = this.count ? this.count : 0
			this.max = this.max ? this.max : Infinity
		}
		else if (data.type == 'machine') {
			
			this.availableCount = this.count ? this.count : 0
			this.count = this.count ? this.count : 0
			this.max = this.max ? this.max : Infinity
		}
		else if (data.type == 'storage') {
			
			this.assignCount = this.assignCount ? this.assignCount : 0
			this.selectCount = this.selectCount ? this.selectCount : 1
		}
		else if (data.type == 'manual') {
			
			this.assignCount = this.assignCount ? this.assignCount : 1
			this.counts = this.counts ? this.counts : [ 1 ]
			this.remainingSeconds = this.seconds ? this.seconds : 0
			this.status = this.status ? this.status : 'stopped'
		}
		else if (data.type == 'production') {
			
			this.assignCount = this.assignCount ? this.assignCount : 0
			this.remainingSeconds = this.seconds ? this.seconds : 0
			this.selectCount = this.selectCount ? this.selectCount : 1
			this.status = this.status ? this.status : 'stopped'
		}
	}

    load(data) {
		
        if (data.assignCount != null) this.assignCount = data.assignCount
		if (data.count != null) this.count = data.count
        if (data.remainingSeconds != null) this.remainingSeconds = data.remainingSeconds
        if (data.status != null) this.status = data.status
	}
    
    getDataToSave() {
        
        let data = {}
		
        if (this.assignCount != null) data.assignCount = this.assignCount
        if (this.count != null) data.count = this.count
        if (this.id != null) data.id = this.id
        if (this.remainingSeconds != null) data.remainingSeconds = this.remainingSeconds
        if (this.status != null) data.status = this.status
		
        return data
    }
	
	getOutputs(startedCount) {
		
		let assignCount = this.assignCount ? this.assignCount : 1
		if (startedCount) assignCount = startedCount
		
		let ret = []		
		ret.push({ id:this.itemId, count:this.output * assignCount })
		
		return ret
	}
	
	getInputs() {
		
		if (!this.inputs) return null
		
		let assignCount = this.assignCount ? this.assignCount : 1
		
		let ret = []
		
		this.inputs.forEach(input => {
			ret.push({ id:input.id, count:input.count * assignCount })
		})
		
		return ret
	}
	
	getCosts() {
		
		if (!this.costs) return null
		
		let ret = []
		
		this.costs.forEach(cost => {
			ret.push({ id:cost.id, count:cost.count })
		})
		
		return ret
	}
}

import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {

	state: () => ({
		
		activeTab: '1',
		currentScenarioId: null,
		lastFrameTimeMs: null,
		lastSavedTime: performance.now(),	
		localStorageName: 'fgfactory',
        paused: false,
		resetInProgress: false,
		timePlayed: 0,
		version: 0.01,
		
        scenarios: [ scenario_1 ],

		elems: [],
		
		victory: false,
		victoryReqs: null,
	}),
	
    getters: {
        
        localStorageData: (state) => { return localStorage.getItem(state.localStorageName) },

		currentScenario: (state) => { return state.scenarios.find(scenario => scenario.id == state.currentScenarioId) },
		
		getElem: (state) => (id) => { return state.elems.find(elem => elem.id == id) },		
        
        isVictoryReached: (state) => {
            
            if (state.victory) return false			
            if (state.victoryReqs) return state.checkCounts(state.victoryReqs)
            
            return false
        },
    },
	
	actions: {
		
		init(scenarioId) {
			
			let scenario = this.scenarios.find(s => s.id == scenarioId)
			this.currentScenarioId = scenarioId

			this.elems = []
			
            let elems = scenario.elems
            elems.forEach(e => {
                
                let newElem = new Elem(e)
                this.elems.push(newElem)
            })
			
			this.victory = false
			this.victoryReqs = scenario.victoryReqs
		},

		load(data) {
			
			this.activeTab = data.activeTab ?? this.activeTab
			this.lastFrameTimeMs = data.lastFrameTimeMs ?? this.lastSavedTime
			this.lastSavedTime = data.lastSavedTime ?? this.lastSavedTime
			this.paused = data.paused ?? this.paused
			this.timePlayed = data.timePlayed ?? this.timePlayed
			
            if (data.elems != null) data.elems.forEach(loadedElem => {
				
                let elem = this.elems.find(e => e.id == loadedElem.id)
                if (elem) elem.load(loadedElem)
            })
		},
		
		refreshAll() {
			
			this.refreshUnlocked()
			
			let elems
			
			elems = this.elems.filter(e => (e.type == 'storer' || e.type == 'machine') && e.count > 0)
			elems.forEach(e => this.refreshAvailableCount(e))

			elems = this.elems.filter(e => e.type == 'storage' && e.assignCount > 0)
			elems.forEach(e => this.refreshMax(e))
		},
		
		refreshUnlocked() {
			
			let elems = this.elems.filter(elem => elem.unlocked == false)
			elems.forEach(elem => elem.unlocked = this.checkCounts(elem.reqs))
		},

		checkCounts(counts) {
			
			let ret = true
			
			counts.forEach(count => {
				
				let elem = this.elems.find(elem => elem.id == count.id)
				if (elem.count < count.count) {
					
					ret = false
					return
				}
			})
			
			return ret
		},
		
		refreshAvailableCount(elem) {
			
			elem.availableCount = elem.count
			
			let elems = this.elems.filter(e => e.assignId == elem.id && e.assignCount > 0)
			elems.forEach(e => elem.availableCount -= e.assignCount)
		},
		
		refreshMax(elem) {
			
			let item = this.elems.find(e => e.id == elem.itemId)
			item.max = item.stack * (1 + (elem.assignCount * elem.slots))
		},
		
		onAssign(elem, count) {
			
			let assignee = this.elems.find(e => e.id == elem.assignId)
			assignee.availableCount -= count
			
			if (elem.type == 'storage') {
				
				let item = this.elems.find(e => e.id == elem.itemId)
				item.max += elem.stack * count
			}
		},
		
		onUnassign(elem, count) {
			
			let assignee = this.elems.find(e => e.id == elem.assignId)
			assignee.availableCount += count
			
			if (elem.type == 'storage') {
				
				let item = this.elems.find(e => e.id == elem.itemId)
				item.max -= elem.stack * count
			}
		},
		
		save(data) {

			data.activeTab = this.activeTab
			data.currentScenarioId = this.currentScenarioId
			data.lastSavedTime = this.lastSavedTime
			data.paused = this.paused
			data.timePlayed = this.timePlayed
			data.version = this.version
			
            data.elems = []
            this.elems.forEach(e => data.elems.push(e.getDataToSave()))
			
			data.victory = this.victory
		},
		
        pause() { this.paused = true },
        resume() { this.paused = false },
		
		doTick() {
			
			let currentTimeMs = performance.now()
			
			let delay = (currentTimeMs - this.lastFrameTimeMs) / 1000		
			if (delay < 1 / 60) return
			
			this.lastFrameTimeMs = currentTimeMs

			if (this.paused) return
			
			this.timePlayed += delay
			
			let manuals = this.elems.filter(e => e.type == 'manual' && e.status == 'waiting')
			manuals.forEach(manual => {
				
				manual.remainingSeconds -= delay
                if (manual.remainingSeconds <= 0) {
					
					let outputs = manual.getOutputs()
					outputs.forEach(output => {
						
						let outputElem = this.elems.find(e => e.id == output.id)
						outputElem.count = Math.min(outputElem.count + output.count, outputElem.max)
						outputElem.count = parseFloat(outputElem.count.toFixed(10))
						
						if (outputElem.type == 'storer' || outputElem.type == 'machine') this.refreshAvailableCount(outputElem)
					})
					
					manual.status = 'stopped'
					manual.remainingSeconds = manual.seconds * manual.assignCount
				}
			})
			
			let productions = this.elems.filter(e => e.type == 'production' && e.assignCount > 0 && e.status != 'stopped')
			productions.forEach(production => {
				
				if (production.status == 'waiting' && this.canStartProduction(production)) this.startProduction(production)
				
				if (production.status == 'started') {
					
					production.remainingSeconds -= delay
					if (production.remainingSeconds <= 0) {
						
						let outputs = production.getOutputs(production.startedCount)
						outputs.forEach(output => {
							
							let outputElem = this.elems.find(e => e.id == output.id)
							outputElem.count = Math.min(outputElem.count + output.count, outputElem.max)
							outputElem.count = parseFloat(outputElem.count.toFixed(10))
						
							if (outputElem.type == 'storer' || outputElem.type == 'machine') this.refreshAvailableCount(outputElem)
						})
						
						if (this.canStartProduction(production)) this.startProduction(production)
						else {
							
							if (production.assignCount <= 0) production.status = 'stopped'
							else production.status = 'waiting'
						
							production.remainingSeconds = production.seconds
						}
					}
				}
			})
		},
		
		canStartProduction(production) {
			
			if (production.assignCount <= 0) return false
			
			let ret = true			
			
			let outputs = production.getOutputs()
			outputs.forEach(output => {
				
				let outputElem = this.elems.find(e => e.id == output.id)
				if (outputElem.count >= outputElem.max) ret = false
			})
			
			if (!ret) return false
			
			let inputs = production.getInputs()
			if (inputs) return this.checkCounts(inputs)
			
			return true
		},

		startProduction(production) {
			
			let inputs = production.getInputs()
			if (inputs) {
				
				inputs.forEach(input => {
					
					let inputElem = this.elems.find(e => e.id == input.id)
					inputElem.count = Math.max(inputElem.count - input.count, 0)
					inputElem.count = parseFloat(inputElem.count.toFixed(10))
				})
			}
			
			production.status = 'started'
			production.remainingSeconds = production.seconds
			production.startedCount = production.assignCount
		},
	},
})
