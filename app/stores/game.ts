import { defineStore } from 'pinia'

export interface WinCondition {
    id: string
    quantity: number
}

export interface Requirement {
    id: string
    quantity: number
}

export interface Purchase {
    time: number
    output: number
    costs: Requirement[]
}

export interface InputOutput {
    id: string
    rate: number
}

export interface Recipe {
    machineId: string
    outputs: InputOutput[]
    inputs?: InputOutput[]
}

export interface Storage {
    itemId: string
    storerId: string
    stock: number
}

export interface Item {
    group: string
    subgroup: string
    id: string
    type: 'item' | 'mission' | 'machine'
    image?: string
    stack?: number
    initialQuantity?: number
    requires?: Requirement[]
    purchase?: Purchase
    recipes?: Recipe[]
    storages?: Storage[]
}

export interface ItemBuildingTask {
    itemId: string
    timeLeft: number
    totalTime: number
    intervalId: any
    costs: Requirement[]
}

export const useGameStore = defineStore('game', () => {

    const items = ref<Item[]>([])
    const totalPlayTime = ref<number>(0)
    const winConditions = ref<WinCondition[]>([])
    const customGameName = ref<string>('')

    const hasWon = ref<boolean>(false)
    const completedRuns = ref<Array<{ datasetId: string; timeSpent: number; date: string }>>([])
    const isCurrentRunWon = ref<boolean>(false)

    const isPaused = ref<boolean>(false)
    const isLoading = ref<boolean>(true)
    const loadingError = ref<string | null>(null)
    const isInitialized = ref<boolean>(false)

    // Localization

    const currentLocale = ref<string>('en')
    const supportedLocales = ref([
        { value: 'fr', label: 'Français', flag: '/flags/fr.png' },
        { value: 'en', label: 'English', flag: '/flags/en.png' }
    ])
    const localeTranslations = ref<Record<string, any>>({})

    if (typeof window !== 'undefined') {
        const browserLang = navigator.language.split('-')[0]
        currentLocale.value = supportedLocales.value.map(locale => locale.value).includes(browserLang) ? browserLang : 'en'
    }

    watch(currentLocale, async () => {  if (isInitialized.value) reloadTranslations() })

    async function reloadTranslations() {
        try {

            const generalJsonPromise = fetch(`/locales/${currentLocale.value}.json`)
                .catch(() => fetch('/locales/en.json'))
                .then(response => response.json())

            const specificJsonPromise = fetch(`/scenarios/${currentDatasetId.value}/locales/${currentLocale.value}.json`)
                .then(response => response.ok ? response.json() : {})
                .catch(() => {
                    console.warn(`Pas de traduction spécifique trouvée pour ${currentDatasetId.value} en ${currentLocale.value}`)
                    return {}
                })

            const [generalJson, specificJson] = await Promise.all([generalJsonPromise, specificJsonPromise])

            localeTranslations.value = {
                ...generalJson,
                scenarios: { ...generalJson.scenarios, ...specificJson.scenarios },
                groups: { ...generalJson.groups, ...specificJson.groups },
                subgroups: { ...generalJson.subgroups, ...specificJson.subgroups },
                items: { ...generalJson.items, ...specificJson.items }
            }
        }
        catch (err) {

            console.error("Erreur lors de la fusion des langues", err)
        }
    }

    // Scenarios

    const DEFAULT_DATASET_ID = 'satisfactory'

    const currentDatasetId = ref<string>(DEFAULT_DATASET_ID)
    const availableDatasets = ref<Array<{ id: string; name: string }>>([])

    const availableGroups = computed(() => {

        const groups = items.value.map(item => item.group)
        return [...new Set(groups)]
    })

    const inventory = ref<Record<string, number>>({})
    const assignedStorers = ref<Record<string, number>>({})
    const assignedMachines = ref<Record<string, number>>({})
    const permanentlyUnlocked = ref<string[]>([])
    const newlyUnlockedItems = ref<string[]>([])

    async function switchScenario(newDatasetId: string) {

        if (typeof window !== 'undefined') localStorage.removeItem('factory_game_save')
        
        isInitialized.value = false
        totalPlayTime.value = 0
        hasWon.value = false
        isCurrentRunWon.value = false
        currentDatasetId.value = newDatasetId
        isPaused.value = false

        await loadGame()
    }

    // Locale Storage

    function getEncryptedData(): string {

        const gameObjectSave = {

            isPaused: isPaused.value,
            currentLocale: currentLocale.value,
            totalPlayTime: totalPlayTime.value,
            completedRuns: completedRuns.value,
            customGameName: customGameName.value,
            isCurrentRunWon: isCurrentRunWon.value,
            currentDatasetId: currentDatasetId.value,
            savedAt: Date.now(),
            newlyUnlockedItems: newlyUnlockedItems.value,

            inventory: inventory.value,
            assignedStorers: assignedStorers.value,
            assignedMachines: assignedMachines.value,
        }

        return encryptData(gameObjectSave)
    }

    function wipeLocalStorage() {

        if (typeof window !== 'undefined') localStorage.removeItem('factory_game_save')
            
        window.location.reload()
    }
    
    async function importEncryptedData(code: string): Promise<boolean> {

        if (!code || code.trim() === '') return false
        
        localStorage.setItem('factory_game_save', code)
        
        window.location.reload()

        return true
    }

    let saveTimeout: ReturnType<typeof setTimeout> | null = null

    function persistGame() {

        if (typeof window === 'undefined' || !isInitialized.value) return

        const encryptedString = getEncryptedData()
        localStorage.setItem('factory_game_save', encryptedString)
    }

    function flushPendingSave() {

        if (saveTimeout === null) return

        clearTimeout(saveTimeout)
        saveTimeout = null
        persistGame()
    }

    function scheduleSave() {

        if (typeof window === 'undefined' || !isInitialized.value || saveTimeout !== null) return

        saveTimeout = setTimeout(() => {
            saveTimeout = null
            persistGame()
        }, 3000)
    }

    watch([inventory, assignedMachines, assignedStorers, currentDatasetId, totalPlayTime, completedRuns, isPaused, currentLocale, customGameName, newlyUnlockedItems], scheduleSave, { deep: true })

    if (typeof window !== 'undefined') {

        window.addEventListener('pagehide', flushPendingSave)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') flushPendingSave()
        })
    }

    // Game
    
    async function loadGame() {

        isLoading.value = true
        loadingError.value = null

        try {

            let savedState: any = null
            if (typeof window !== 'undefined') {

                const rawSave = localStorage.getItem('factory_game_save')
                if (rawSave) savedState = decryptData(rawSave)
            }

            currentDatasetId.value = savedState?.currentDatasetId || DEFAULT_DATASET_ID

            availableDatasets.value = [
				{ id: "satisfactory", name: "scenarios.satisfactory" },
			]

            if (availableDatasets.value.length > 0 && !availableDatasets.value.some(d => d.id === currentDatasetId.value)) {
                currentDatasetId.value = availableDatasets.value[0].id
            }

            currentLocale.value = savedState?.currentLocale || currentLocale.value

            const [data] = await Promise.all([
                fetch(`/scenarios/${currentDatasetId.value}/data.json`).then(response => response.json()),
                reloadTranslations()
            ])

            items.value = data.items || []

            winConditions.value = data.winConditions || []

            const savedInv = savedState?.inventory || {}
            const tempInventory: Record<string, number> = {}
            items.value.forEach(item => {
                tempInventory[item.id] = savedInv[item.id] ?? item.initialQuantity ?? 0
            })
            
            inventory.value = tempInventory
            newlyUnlockedItems.value = Array.isArray(savedState?.newlyUnlockedItems) ? savedState.newlyUnlockedItems : []
            permanentlyUnlocked.value = []

            items.value.forEach(item => {

                item.image = `/scenarios/${currentDatasetId.value}/img/${item.id}.png`

                isItemUnlocked(item)

                if (!item.recipes) return

                item.recipes.forEach(recipe => { isRecipeUnlocked(recipe) })
            })

            assignedMachines.value = savedState?.assignedMachines || {}
            assignedStorers.value = savedState?.assignedStorers || {}
            totalPlayTime.value = Number(savedState?.totalPlayTime || 0)
            completedRuns.value = savedState?.completedRuns || []
            customGameName.value = savedState?.customGameName || ''
            isCurrentRunWon.value = savedState?.isCurrentRunWon || false

            hasWon.value = false

            const savedAt = Number(savedState?.savedAt)
            const offlineSeconds = savedState?.isPaused || !Number.isFinite(savedAt)
                ? 0
                : Math.max(0, Math.floor((Date.now() - savedAt) / 1000))

            if (offlineSeconds > 0) {
                totalPlayTime.value += offlineSeconds
                applyProduction(offlineSeconds)
                checkVictoryConditions()
            }

            isPaused.value = false

            nextTick(() => { isInitialized.value = true })

            startGameLoop()
        }
        catch (err: any) {

            loadingError.value = err.message === 'fetch_failed' ? 'fetch_failed' : 'unknown'
        }
        finally {

            isLoading.value = false
        }
    }
    
    function resetGame() {

        isInitialized.value = false

        if (typeof window !== 'undefined') localStorage.removeItem('factory_game_save')

        isPaused.value = false
        totalPlayTime.value = 0
        isCurrentRunWon.value = false

        inventory.value = {}
        assignedStorers.value = {}
        assignedMachines.value = {}

        const encryptedString = getEncryptedData()
        localStorage.setItem('factory_game_save', encryptedString)

        window.location.reload()
    }

    function checkVictoryConditions() {

        if (winConditions.value.length === 0 || hasWon.value) return

        const isVictorious = winConditions.value.every(condition => {
            return (inventory.value[condition.id] || 0) >= condition.quantity
        })

        if (isVictorious && !isCurrentRunWon.value && !hasWon.value) triggerVictory()
        else if (!isVictorious && isCurrentRunWon.value) isCurrentRunWon.value = false
    }

    function triggerVictory() {

        hasWon.value = true
        isCurrentRunWon.value = true

        completedRuns.value.push({

            datasetId: currentDatasetId.value,
            timeSpent: totalPlayTime.value,
            date: new Date().toLocaleString()
        })
    }

    function togglePause() {

        isPaused.value = !isPaused.value
        lastGameTickAt = Date.now()
    }

    let gameLoopInterval: NodeJS.Timeout | null = null
    let lastGameTickAt = 0

    function applyProduction(elapsedSeconds: number) {

        if (elapsedSeconds <= 0) return

        const prods = getItemProds.value
        const storages = getItemStorages.value

        Object.keys(prods).forEach((itemId) => {

            const prod = prods[itemId]
            if (prod === 0) return

            const currentStock = inventory.value[itemId]
            const nextStock = Math.min(storages[itemId], currentStock + prod * elapsedSeconds)
            if (nextStock !== currentStock) inventory.value[itemId] = nextStock
        })
    }

    function startGameLoop() {

        if (gameLoopInterval) clearInterval(gameLoopInterval)

        lastGameTickAt = Date.now()

        gameLoopInterval = setInterval(() => {

            const now = Date.now()

            if (isPaused.value || !isInitialized.value) {
                lastGameTickAt = now
                return
            }

            const elapsedSeconds = Math.floor((now - lastGameTickAt) / 1000)
            if (elapsedSeconds < 0) {
                lastGameTickAt = now
                return
            }
            if (elapsedSeconds === 0) return

            lastGameTickAt += elapsedSeconds * 1000
            totalPlayTime.value += elapsedSeconds
            applyProduction(elapsedSeconds)

            checkVictoryConditions()

        }, 1000)
    }

    // Item

    function getItemById(itemId: string): Item | undefined {

        return items.value.find(item => item.id === itemId)
    }

    function getItemImage(itemId: string): string {

        const item = items.value.find(item => item.id === itemId)
        return item?.image ?? ''
    }

    function getItemStock(itemId: string): number {

        return inventory.value[itemId]?.toFixed(0) || 0
    }

    function isItemStorageFull(itemId: string): boolean {

        return getItemStock(itemId) >= getItemStorages.value[itemId]
    }
    
    const getItemProds = computed(() => {

        const prods: Record<string, number> = {}

        items.value.forEach(item => { prods[item.id] = 0 })

        items.value.forEach(item => {

            if (!item.recipes) return

            item.recipes.forEach((recipe: any) => {

                const machineCount = getAssignedMachineCount(item.id, recipe.machineId)
                if (machineCount <= 0) return

                if (recipe.inputs) {
                    recipe.inputs.forEach((input: any) => {
                        if (prods[input.id] !== undefined) prods[input.id] -= input.rate * machineCount
                    })
                }

                recipe.outputs.forEach((output: any) => {
                    if (prods[output.id] !== undefined) prods[output.id] += output.rate * machineCount
                })
            })
        })

        return prods
    })

    const getItemStorages = computed(() => {

        const storages: Record<string, number> = {}

        items.value.forEach(item => { storages[item.id] = item.stack ?? Infinity })

        items.value.forEach(item => {

            if (!item.storages) return

            item.storages.forEach((storage: any) => {

                const storerCount = getAssignedStorerCount(item.id, storage.storerId)
                if (storerCount <= 0) return

                storages[item.id] += storerCount * storage.stock
            })
        })

        return storages
    })

    function isItemUnlocked(item: Item): boolean {

        if (permanentlyUnlocked.value.includes(item.id)) return true

        if (!item.requires || item.requires.length === 0) {

            if (!permanentlyUnlocked.value.includes(item.id))
                permanentlyUnlocked.value.push(item.id)

            return true
        }

        const requirementsMet = item.requires.every((req: any) => getItemStock(req.id) >= req.quantity)

        if (requirementsMet) {
            permanentlyUnlocked.value.push(item.id)
            if (isInitialized.value && !newlyUnlockedItems.value.includes(item.id)) {
                newlyUnlockedItems.value.push(item.id)
            }
            return true
        }

        return false
    }

    function hasNewUnlock(itemId: string): boolean {

        return newlyUnlockedItems.value.includes(itemId)
    }

    function markItemModalOpened(itemId: string) {

        newlyUnlockedItems.value = newlyUnlockedItems.value.filter(id => id !== itemId)
    }

    function isRecipeUnlocked(recipe: any): boolean {

        const machineItem = items.value.find(item => item.id === recipe.machineId)
        if (!isItemUnlocked(machineItem)) return false

        let result = true
        if (recipe.inputs) result = recipe.inputs.every((input: any) => permanentlyUnlocked.value.includes(input.id))
        if (!result) return false

        return recipe.outputs.every((output: any) => permanentlyUnlocked.value.includes(output.id))
    }

    function isStorageUnlocked(storage: any): boolean {

        const storerItem = items.value.find(item => item.id === storage.storerId)
        if (!isItemUnlocked(storerItem)) return false

        const item = items.value.find(item => item.id === storage.itemId)
        if (!isItemUnlocked(item)) return false

        return true
    }

    // Item Building

    const activeItemBuildings = ref<Record<string, ItemBuildingTask>>({})

    function canBuildItem(item: Item): boolean {

        if (!item.purchase || !item.purchase.costs) return true
        return item.purchase.costs.every(cost => getItemStock(cost.id) >= cost.quantity)
    }

    function startItemBuilding(item: GameItem) {

        if (!item.purchase || !canBuildItem(item) || activeItemBuildings.value[item.id] || isItemStorageFull(item.id)) return

        if (item.purchase.costs) {

            item.purchase.costs.forEach(cost => {
                inventory.value[cost.id] -= cost.quantity
            })
        }

        const totalTime = item.purchase.time

        const intervalId = setInterval(() => {

            const task = activeItemBuildings.value[item.id]
            if (!task) return

            task.timeLeft -= 0.1

            if (task.timeLeft <= 0) {

                const max = getItemStorages.value[item.id]
                inventory.value[item.id] = Math.min(max, inventory.value[item.id] + item.purchase.output)

                clearInterval(task.intervalId)
                delete activeItemBuildings.value[item.id]
            }
        }, 100)

        activeItemBuildings.value[item.id] = {
            itemId: item.id,
            timeLeft: totalTime,
            totalTime: totalTime,
            costs: item.purchase.costs ? [...item.purchase.costs] : [],
            intervalId
        }
    }

    function cancelItemBuilding(itemId: string) {

        const task = activeItemBuildings.value[itemId]
        if (!task) return

        task.costs.forEach(cost => {
            inventory.value[cost.id] += cost.quantity
        })

        clearInterval(task.intervalId)
        delete activeItemBuildings.value[itemId]
    }

    // Item Production

    function getFreeMachineCount(machineId: string): number {

        const totalOwned = getItemStock(machineId)

        let totalAssigned = 0
        Object.keys(assignedMachines.value).forEach(key => {

            if (key.endsWith(`_${machineId}`)) totalAssigned += assignedMachines.value[key] || 0
        })

        return Math.max(0, totalOwned - totalAssigned)
    }

    function getAssignedMachineCount(itemId: string, machineId: string): number {

        return assignedMachines.value[`${itemId}_${machineId}`] || 0
    }

    function canAssignMachine(machineId: string, recipe: any): boolean {

        if (getFreeMachineCount(machineId) <= 0) return false

        if (recipe.inputs) {
            return recipe.inputs.every((input: any) => {
                return getItemProds.value[input.id] >= input.rate
            })
        }

        return true
    }

    function canUnassignMachine(itemId: string, machineId: string, recipe: any): boolean {

        if (getAssignedMachineCount(itemId, machineId) <= 0) return false

        return recipe.outputs.every((output: any) => {
            return getItemProds.value[output.id] - output.rate >= 0
        })
    }

    function changeMachineAssignment(itemId: string, machineId: string, recipe: any, amount: number) {

        const key = `${itemId}_${machineId}`
        const current = assignedMachines.value[key] || 0
        
        if (amount > 0 && canAssignMachine(machineId, recipe)) assignedMachines.value[key] = current + amount
        else if (amount < 0 && canUnassignMachine(itemId, machineId, recipe)) assignedMachines.value[key] = current + amount
    }

    function getRecipesByMachine(machineId: string) {

        const recipes = []
        items.value.forEach(item => {
            if (item.recipes) recipes.push(...item.recipes)
        })

        return recipes.filter((recipe: any) => recipe.machineId === machineId)
    }

    // Item Storage

    function getFreeStorerCount(storerId: string): number {

        const totalOwned = getItemStock(storerId)

        let totalAssigned = 0
        Object.keys(assignedStorers.value).forEach(key => {

            if (key.endsWith(`_${storerId}`)) totalAssigned += assignedStorers.value[key] || 0
        })

        return Math.max(0, totalOwned - totalAssigned)
    }

    function getAssignedStorerCount(itemId: string, storerId: string): number {

        return assignedStorers.value[`${itemId}_${storerId}`] || 0
    }

    function canAssignStorer(storerId: string, itemId: string): boolean {

        if (getFreeStorerCount(storerId) <= 0) return false

        const item = getItemById(itemId)
        if (item.storages) {
            return item.storages.find((storage: any) => {
                return storage.storerId === storerId
            }) !== undefined
        }

        return true
    }

    function canUnassignStorer(itemId: string, storerId: string): boolean {

        const item = getItemById(itemId)
        if (getAssignedStorerCount(item.id, storerId) <= 0) return false

        return getItemStorages.value[item.id] - item.stack >= getItemStock(item.id)
    }

    function changeStorerAssignment(itemId: string, storerId: string, amount: number) {

        const key = `${itemId}_${storerId}`
        const current = assignedStorers.value[key] || 0
        
        if (amount > 0 && canAssignStorer(storerId, itemId)) assignedStorers.value[key] = current + amount
        else if (amount < 0 && canUnassignStorer(itemId, storerId)) assignedStorers.value[key] = current + amount
    }

    function getStoragesByStorer(storerId: string) {

        const storages = []
        items.value.forEach(item => {
            if (item.storages) storages.push(...item.storages)
        })

        return storages.filter((storage: any) => storage.storerId === storerId)
    }

    // Utils

    function t(path: string): string {

        let current = localeTranslations.value

        const keys = path.split('.')
        for (const key of keys) {

            if (current && current[key] !== undefined) current = current[key]
            else return path
        }

        return typeof current === 'string' ? current : path
    }

    function formatTime(seconds: number): string {

        seconds = Math.ceil(seconds)
        if (seconds <= 0) return '00:00:00'

        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60

        const hStr = String(h).padStart(2, '0')
        const mStr = String(m).padStart(2, '0')
        const sStr = String(s).padStart(2, '0')

        return `${hStr}:${mStr}:${sStr}`
    }

    function encryptData(obj: any): string {

        const jsonString = JSON.stringify(obj)

        return btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (_, p1) => {
            return String.fromCharCode(parseInt(p1, 16))
        }))
    }

    function decryptData(cipherText: string): any {
        try {
    
            const decodedString = decodeURIComponent(Array.prototype.map.call(atob(cipherText), (c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            }).join(''))
   
            return JSON.parse(decodedString)
        }
        catch (e) {

            console.error("Échec du décryptage ou données corrompues, retour à l'état initial.", e)
            return null
        }
    }

    // State

    return { items, totalPlayTime, availableGroups, 
             isInitialized, isPaused, isLoading, loadingError, customGameName,
             hasWon, completedRuns, isCurrentRunWon,
             currentLocale, supportedLocales, 
             currentDatasetId, availableDatasets, inventory,
             switchScenario, 
             getEncryptedData, wipeLocalStorage, importEncryptedData,
             loadGame, resetGame, togglePause, 
             getItemById, getItemImage, getItemStorages, getItemStock, isItemStorageFull, getItemProds, isItemUnlocked, hasNewUnlock, markItemModalOpened, isRecipeUnlocked, isStorageUnlocked,
             activeItemBuildings, canBuildItem, startItemBuilding, cancelItemBuilding, 
             getFreeMachineCount, getAssignedMachineCount, canAssignMachine, canUnassignMachine, changeMachineAssignment, getRecipesByMachine,
             getFreeStorerCount, getAssignedStorerCount, canAssignStorer, canUnassignStorer, changeStorerAssignment, getStoragesByStorer,
             t, formatTime
            }
})