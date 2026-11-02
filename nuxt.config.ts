export default defineNuxtConfig({

	ssr: false,
	
    compatibilityDate: '2025-07-15',

    devtools: { enabled: false },

    modules: [ '@pinia/nuxt', '@nuxt/ui' , '@nuxtjs/i18n'],

    css: ['~/assets/css/main.css'],

    app: {
        head: {
            link: [
                { rel: 'icon', type: 'image/png', href: '/favicon.png' }
            ]
        }
    },

	routeRules: {
		'/': { redirect: { to: '/missions', statusCode: 301 } }
	},

	i18n: {
		locales: [
			{ code: 'en', file: 'en.json' },
			{ code: 'fr', file: 'fr.json' }
		],
		defaultLocale: 'en'
	}
})
