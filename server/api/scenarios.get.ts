import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {

    const scenariosDir = path.resolve(process.cwd(), 'public/scenarios')

    try {

        if (!fs.existsSync(scenariosDir)) return []

        const files = await fs.promises.readdir(scenariosDir, { withFileTypes: true })

        const scenarios = files.filter(dirent => dirent.isDirectory()).map(dirent => {

            const formattedName = dirent.name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

            return {
                id: dirent.name,
                name: formattedName
            }
        })

        return scenarios
    }
    catch (error) {

        throw createError({
            statusCode: 500,
            statusMessage: 'Impossible de scanner les répertoires de scénarios.'
        })
    }
})