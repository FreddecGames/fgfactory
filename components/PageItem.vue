<template>
    <div class="col-auto scrollbar" style="width:500px;">
        <div class="row g-3">
            <CardProduction :item="item" />
            <CardBuildable v-if="item.storage.unlocked == true" :buildable="item.storage" />
            <CardBuildable v-if="item.building.unlocked == true" :buildable="item.building" />
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'item' ],    
}
</script>