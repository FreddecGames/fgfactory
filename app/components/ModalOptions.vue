<script setup lang="ts">

	import { useGameStore } from '~/stores/game'

	const gameStore = useGameStore()

	const { locales, localeProperties, setLocale } = useI18n()

 	const areDataCopied = ref(false)

    async function copyDataToClipboard() {

        const saveCode = gameStore.getEncryptedData()
        
        try {

            await navigator.clipboard.writeText(saveCode)
            areDataCopied.value = true
            
            setTimeout(() => { areDataCopied.value = false }, 2000)            
        }
        catch (err) {

            console.error($t('options.export_error'), err)
        }
    }

    const importInput = ref('')

    const importStatus = ref<'idle' | 'success' | 'error'>('idle')

    async function importData() {

        const success = await gameStore.importLocalData(importInput.value)
        
        if (success) {

            importStatus.value = 'success'
            importInput.value = ''
        }
        else {

            importStatus.value = 'error'
        }

        setTimeout(() => { importStatus.value = 'idle' }, 3000)
    }

</script>

<template>

	<UModal scrollable :ui="{ content: 'w-[calc(100vw-1.5rem)] min-w-0', body: 'min-w-0' }">
		
		<!-- Modal Header -->
		<template #header>

			<div class="flex items-center gap-3">
				<UIcon name="i-lucide-settings" class="text-primary size-5" />
				<h3 class="text-lg font-bold text-white">{{ $t('options.title') }}</h3>
			</div>

			<UButton color="neutral" variant="ghost" icon="i-lucide-x"
				@click="gameStore.isOptionsModalOpen = false" />

		</template>

		<!-- Modal Body -->
		<template #body>

			<!-- Language -->
			<div class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('options.language') }}</h4>

				<div class="grid grid-cols-2 gap-2">

					<UButton v-for="locale in locales" :key="locale.code"
						variant="subtle" :color="localeProperties.code === locale.code ? 'primary' : 'neutral'" class="justify-center"
						@click="setLocale(locale.code)">

						<div class="flex items-center gap-3">
							<img :src="`/flags/${locale.code}.png`" :alt="$t('lang_' + locale.code)"  class="w-6 h-6" />
							<span>{{ $t('lang_' + locale.code) }}</span>
						</div>
						
					</UButton>

				</div>

			</div>

			<!-- Options -->
			<div class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('options.options') }}</h4>

				<div class="flex flex-col space-y-2">

					<UInput v-model="gameStore.customGameName" block
						:placeholder="$t('options.game_name_placeholder')"
						class="w-full" />

				</div>

			</div>

			<!-- Local Data -->
			<div class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('options.local_storage') }}</h4>

				<div class="grid grid-cols-2 gap-2">

					<!-- Wipe Data -->
					<UPopover>

						<UButton block color="error" variant="subtle" icon="i-lucide-trash-2">
							{{ $t('options.wipe') }}
						</UButton>

						<template #content>
							<UCard :ui="{ 'body': 'p-3 sm:p-3' }">
								<div class="flex flex-col items-center gap-4">

									<span class="w-48 text-center text-xs font-semibold text-error">{{ $t('options.wipe_confirm') }}</span>

									<UButton color="error" variant="subtle"
										@click="() => { gameStore.wipeLocalData(); gameStore.isOptionsModalOpen = false; }">
										{{ $t('labels.confirm') }}
									</UButton>

								</div>
							</UCard>
						</template>

					</UPopover>

					<!-- Export Data -->
					<UButton block variant="subtle"
						:color="areDataCopied ? 'success' : 'primary'"                                        
						:icon="areDataCopied ? 'i-lucide-check' : 'i-lucide-clipboard-copy'"
						@click="copyDataToClipboard">
						{{ areDataCopied ? $t('options.export_success') : $t('options.export') }}
					</UButton>

				</div>

			</div>

			<!-- Import Save -->
			<div class="flex flex-col space-y-2">

				<h4 class="text-xs font-semibold text-neutral-400">{{ $t('options.import_title') }}</h4>

				<div class="flex flex-col space-y-2">

					<UTextarea v-model="importInput" :rows="3" autoresize block
						:placeholder="$t('options.import_placeholder')"                                        
						class="text-xs" />

					<UButton block variant="subtle"
						:color="importStatus === 'success' ? 'success' : importStatus === 'error' ? 'error' : 'primary'"                                        
						:icon="importStatus === 'success' ? 'i-lucide-check' : importStatus === 'error' ? 'i-lucide-alert-triangle' : 'i-lucide-download'"
						:disabled="!importInput.trim()"
						@click="importData">
						{{ 
							importStatus === 'success' ? $t('options.import_success') : 
							importStatus === 'error' ? $t('options.import_error') : 
							$t('options.import') 
						}}
					</UButton>
				
				</div>

			</div>

		</template>

	</UModal>

</template>