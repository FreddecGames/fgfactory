<template>
    <div class="col scrollbar">
        <div class="row g-3">
            <CardProduction :item="item" />
            <CardStorage v-if="item.storage.unlocked == true" :storage="item.storage" />
            <CardBuilding v-if="item.building.unlocked == true" :building="item.building" />
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'item' ],    
}
</script>