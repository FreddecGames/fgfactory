export default defineAppConfig({
    ui: {

        colors: {
            primary: 'amber',
            neutral: 'zinc',
        },

		avatar: {
			slots: {
				image: 'h-full w-full rounded-none object-cover',
			},
		},

		modal: {
			slots: {
				header: 'px-3 py-2 sm:p-3 flex items-center justify-between gap-2',
				body: 'flex-1 p-3 sm:p-3 flex flex-col space-y-6',
			},
			variants: {
				fullscreen: {
					false: {
						content: 'w-full max-w-lg rounded-lg shadow-lg ring ring-default',
					},
				},
			},
			compoundVariants: [
				{ class: { overlay: 'grid place-items-center p-3 sm:py-3' }, },
			],
		},
    }
})