// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

    compatibilityDate: '2025-07-15',

    devtools: { enabled: true },

    modules: [ '@pinia/nuxt', '@nuxt/ui' ],

    css: ['~/assets/css/main.css'],

    app: {
        head: {
            link: [
                { rel: 'icon', type: 'image/png', href: '/favicon.png' }
            ]
        }
    }
})
