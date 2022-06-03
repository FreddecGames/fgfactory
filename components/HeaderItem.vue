<template>
    <div class="col-12">
        <div class="row gx-2 align-items-center">
            <div class="col-auto">
                <img :src="require(`~/assets/items/${item.id}.png`)" width="18px" height="18px" :title="$t('itemName_' + item.id)" :alt="$t('itemName_' + item.id)" />
            </div>
            <div class="col">
                <span class="h5">{{ $t('itemName_' + item.id) }}</span>
            </div>
            <div class="col-auto">
                <span :class="{ 'text-danger':item.count >= item.getMax(), 'text-muted':item.count < 1 }"><FormatNumber :value="item.count" /></span>
                <span class="text-muted">/<FormatNumber :value="item.getMax()" /></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'item' ],    
}
</script>