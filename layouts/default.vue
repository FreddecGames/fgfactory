<script setup>

	const { t } = useI18n()
	
	import { useAppStore } from '~/store.js'    
	const store = useAppStore()
	
	const sidebarOpen = ref(false)
	
	const topItems = computed(() => {
	
		let menu = []
		
		menu.push({ label:t('word_scenarios'), icon:'i-lucide-trophy', to:'/scenarios', onSelect:function() { sidebarOpen.value = false } })
		menu.push({ label:t('word_options'), icon:'i-lucide-settings', to:'/options', onSelect:function() { sidebarOpen.value = false } })
		
		return menu
	})
	
	const sideItems = computed(() => {
	
		let menu = []
		
		menu.push({ label:t('word_missions'), icon:'i-lucide-list-checks', to:'/missions', onSelect:function() { sidebarOpen.value = false } })
		menu.push({ label:t('word_techs'), icon:'i-lucide-flask-conical', to:'/techs', onSelect:function() { sidebarOpen.value = false } })
		
		return menu
	})
	
	const tabItems = computed(() => {
			
		let ret = []
		
		let tabs = store.elems.filter(e => e.type == 'tab')
		tabs.forEach(tab => {
			
			let newTab = { label:t(tab.label), icon:tab.icon, children:[] }
			ret.push(newTab)
			
			let entries = store.elems.filter(e => e.type == 'entry' && e.parentId == tab.id)
			entries.forEach(entry => {
				
				let newEntry = { label:t(entry.label), open:true, type:'label', slot:'entry', children:[] }
				newTab.children.push(newEntry)
				
				let pages = store.elems.filter(e => e.type == 'page' && e.parentId == entry.id)
				pages.forEach(page => {
					
					let newPage = {}
					
					newPage.label = t(page.label)
					newPage.to = page.link
					
					if (page.itemId) {
					
						let item = store.elems.find(e => e.id == page.itemId)
					
						newPage.slot = 'elem'
						newPage.img = item.img
						newPage.type = item.type
						newPage.itemId = item.id
						newPage.unlocked = item.unlocked
					}
					
					newPage.onSelect = function() { sidebarOpen.value = false }
					
					newEntry.children.push(newPage)
				})
			})
		})
		
		return ret
	})
	
</script>

<template>

	<header class="bg-(--ui-bg) border-b border-zinc-700 h-(--ui-header-height) sticky top-0 z-50">
		<div class="w-full px-3 flex items-center justify-between gap-3 h-full">
		
			<div class="lg:hidden">
				<UButton v-if="sidebarOpen == false" variant="subtle" color="neutral" icon="i-lucide-menu" @click="sidebarOpen = true;"/>
				<UButton v-if="sidebarOpen == true" variant="subtle" color="neutral" icon="i-lucide-x" @click="sidebarOpen = false;"/>
			</div>
			
			<div class="flex items-center gap-2">				
				<img src="/favicon.png" width="24" height="24" class="rounded" />
				<span class="truncate text-xl font-bold">{{ $t('game_title') }}</span>				
			</div>
			
			<div class="flex items-center gap-2">
			
				<UPopover mode="hover">
				
					<UButton icon="i-lucide-badge-alert" color="error" variant="subtle" label="v0.08" />
					
					<template #content>
						<div class="w-48 p-2 text-xs text-error text-center">
							{{ $t('disclaimer') }}
						</div>
					</template>
					
				</UPopover>
				
				<UNavigationMenu class="hidden lg:flex" :items="topItems" />
				
				<UDropdownMenu class="lg:hidden" :items="topItems" :ui="{ content:'w-48' }">
					<UButton variant="subtle" color="neutral" icon="i-lucide-ellipsis-vertical" />
				</UDropdownMenu>
				
			</div>
			
		</div>
	</header>

	<main class="min-h-[calc(100vh-var(--ui-header-height))]">
		
		<aside id="sidebar" class="relative border-r border-zinc-700 flex flex-col bg-(--ui-bg)" :class="{ 'open':sidebarOpen }">
			
			<div class="flex-1 overflow-y-auto">
				
				<UNavigationMenu :items="sideItems" class="mt-1" :ui="{ root:'relative block', item:'flex-1', link:'justify-center' }" />
				
				<UTabs variant="link" :items="tabItems" v-model="store.activeTab" class="gap-0 w-full border-zinc-700" :ui="{ trigger:'flex-1' }">
					<template #content="{ item }">
						<div class="px-3 py-3">
							<UNavigationMenu orientation="vertical" :items="item.children">

								<template #entry-trailing="{ item }">
									<span></span>
								</template>e>
								
								<template #elem-leading="{ item }">
									<img v-if="item.unlocked" :src="item.img" width="16" height="16" />
									<UIcon v-else name="i-lucide-lock-keyhole" />
								</template>

								<template #elem-trailing="{ item }">
									<elem-available-menu v-if="item.unlocked && item.type == 'machine' || item.type == 'storer'" :id="item.itemId" />
									<elem-count-menu v-if="item.unlocked" :id="item.itemId" />
								</template>

							</UNavigationMenu>
						</div>
					</template>
				</UTabs>
				
			</div>
			
			<div class="border-t border-zinc-700 h-(--ui-header-height)">
				<div class="w-full px-3 flex items-center gap-2 h-full">
				
					<div class="grid gap-0">
						<span class="text-xs text-zinc-400 font-semibold">{{ $t('word_timePlayed') }}</span>
						<time-played />
					</div>
					
					<div class="ms-auto">
					
						<UTooltip v-if="store.paused == false" :text="$t('word_pause')" :delay-duration="0">
							<UButton variant="subtle" color="error" icon="i-lucide-square" @click="store.pause()"/>
						</UTooltip>
						
						<UTooltip v-else-if="store.paused == true" :text="$t('word_resume')" :delay-duration="0">
							<UButton variant="subtle" color="primary" icon="i-lucide-play" @click="store.resume()"/>
						</UTooltip>
						
					</div>
				
				</div>
			</div>

		</aside>

		<div id="content" class="relative grid grid-cols-subgrid overflow-y-auto">
			<div class="mx-auto w-full max-w-2xl">
				<div class="px-3 py-6">				
					<slot />
				</div>
			</div>
		</div>
		
	</main>
	
</template>

<style>

    #sidebar {
        position: fixed; top: var(--ui-header-height); bottom: 0; left: 0; z-index: 20;
        width: 100%;
        transform: translateX(-100%) translateY(0) translateZ(0);
        transition: transform .28s ease-out;
    }

    @media (max-width: 768px) { #sidebar.open { transform: translateX(0) translateY(0) translateZ(0); } }
    @media (min-width: 768px) { #sidebar { width: 290px; transform: translateX(0) translateY(0) translateZ(0); } }

    #content {
        position: fixed; top: var(--ui-header-height); bottom:0; left: 0; right: 0; z-index: 10;
    }

    @media (min-width: 768px) { #content { left: 290px; } }
	
</style>
