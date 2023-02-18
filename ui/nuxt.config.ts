// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: [
        'primevue/resources/themes/saga-green/theme.css',
        'primevue/resources/primevue.css',
        'primeicons/primeicons.css',
        'primeflex/primeflex.css',
        'vue-json-pretty/lib/styles.css',
    ],
    plugins: [
        '@/plugins/vue-json-pretty',
        '@/plugins/primevue',
    ],
	build: {
		transpile: ['primevue']
	},
    nitro: {
        devProxy: {
            '/api': {
                target: "http://127.0.0.1:8000/api",
                changeOrigin: true
            }
        }
    }
})
