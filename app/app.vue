<script setup>

    useHead({

		title: $t('gameName'),

		bodyAttrs: {
            class: "min-h-screen bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed overflow-y-scroll"
        },
    })
</script>

<template>
    <UApp :tooltip="{ delayDuration: 0 }">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>