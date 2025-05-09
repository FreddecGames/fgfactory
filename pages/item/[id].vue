<script setup>

	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const route = useRoute()
	
	const item = computed(() => store.elems.find(e => e.id == route.params.id))
	
	onMounted(() => {
	
		let page = store.elems.find(e => e.link == '/item/' + route.params.id)
		let entry = store.elems.find(e => e.id == page.parentId)
		let tab = store.elems.find(e => e.id == entry.parentId)
		
		let tabs = store.elems.filter(e => e.type == 'tab')
		let index = tabs.indexOf(tab)
		
		store.activeTab = index.toString()
	})
	
	const storage = computed(() => store.elems.find(e => e.type == 'storage' && e.itemId == route.params.id))

	const manual = computed(() => store.elems.find(e => e.type == 'manual' && e.itemId == route.params.id))

	const production = computed(() => store.elems.find(e => e.type == 'production' && e.itemId == route.params.id))
	
</script>

<template>

	<UCard v-if="item.unlocked == false" variant="outline">
		<div class="grid gap-6">
		
			<div class="flex items-center gap-2">				
				<btn-requirements :id="item.id" />
				<span class="text-lg font-semibold opacity-50">{{ $t(item.label) }}</span>				
			</div>
			
		</div>
	</UCard>

	<div v-else class="grid gap-6">
				
		<UCard variant="outline">
			<div class="grid gap-6">
			
				<div class="flex items-center gap-2">
				
					<img :src="item.img" width="24" height="24" />
					<span class="truncate text-lg font-semibold">{{ $t(item.label) }}</span>
					
					<div class="ms-auto flex items-center gap-2">
						<elem-available-page v-if="item.type == 'machine' || item.type == 'storer'" :id="item.id" />
						<elem-count-page :id="item.id" />
					</div>
					
				</div>
				
				<div class="grid lg:grid-cols-2 gap-6 items-start">
				
					<div v-if="storage" class="grid gap-2">

						<span class="text-xs font-semibold opacity-75">{{ $t('word_storage') }}</span>
						
						<div class="p-2 rounded bg-zinc-800 grid gap-2">		
							<line-assignment :id="storage.id" />
						</div>
						
					</div>
				
					<div v-if="manual" class="grid gap-2">

						<span class="text-xs font-semibold opacity-75">{{ $t('word_manual') }}</span>

						<div class="p-2 rounded bg-zinc-800 grid gap-2">
							<line-recipe :id="manual.id" class="flex-1" />
							<line-start :id="manual.id" />
						</div>
						
					</div>
					
				</div>
				
			</div>
		</UCard>

		<card-production v-if="production" :id="production.id" />
		
	</div>

</template>