export default defineAppConfig({
    ui: {

        colors: {
            primary: 'amber',
            neutral: 'zinc'
        },

		modal: {
			slots: {
				header: 'p-4 sm:p-4 flex items-center justify-between gap-2',
				body: 'flex-1 p-4 sm:p-4 flex flex-col space-y-6'
			}
		}
    }
})