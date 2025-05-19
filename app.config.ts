export default defineAppConfig({
	ui:{
		
		colors:{
			
			primary:'amber',
			neutral:'zinc',
		},
		
		alert:{
			
			slots:{
				
				root: 'relative overflow-hidden w-full rounded-lg p-3 flex gap-2',
				wrapper:'flex-initial min-w-0 flex flex-col',
			},
		},

		chip: {
			
			slots: {
				
				base: 'rounded-full ring ring-bg flex items-center justify-center text-inverted font-medium whitespace-nowrap px-1',
			},
			
			compoundVariants: [
			
				{ class: 'z-10 px-1 translate-y-1/2 translate-x-0 transform' },
			],
		},
		
		button: {
			
			slots: {
				
				base: [
					'rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-25 aria-disabled:opacity-25',
					'transition-colors'
				],
			},
		},

		card: {
			
			slots: {
				
				body: 'p-3 sm:p-3',
			},
		},
	}
})
