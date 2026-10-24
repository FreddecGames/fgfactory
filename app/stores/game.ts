import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {

    // Game
    
    async function loadGame() {
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
})