<script setup>
    useHead({
        bodyAttrs: {
            class: "min-h-screen bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed overflow-y-scroll"
        }
    })
</script>

<template>
    <UApp>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>