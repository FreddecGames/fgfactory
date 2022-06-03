<template>
    <div class="col scrollbar">
        <div class="row g-3">
            <HeaderItem :item="item" />
            <CardProduction :item="item" />
            <CardStorages v-if="item.game.storages[item.id + 'S1'].unlocked == true" :item="item" />
            <CardBuildings v-if="item.game.buildings[item.id + 'T1'].unlocked == true" :item="item" />
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'item' ],    
}
</script>