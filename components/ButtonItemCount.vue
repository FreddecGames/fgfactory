<template>
    <div v-if="item.unlocked == true" class="list-group-item list-group-item-action py-1" :class="{ 'active':active }" >
        <div class="row gx-2 align-items-center">
            <div class="col">
                <button type="button" class="w-100 btn px-0 align-items-center" @click="$emit('click')">
                    <div class="col-auto">
                        <img :src="require(`~/assets/items/${item.id}.png`)" width="18px" height="18px" :title="$t('itemName_' + item.id)" :alt="$t('itemName_' + item.id)" />
                    </div>
                    <div class="col text-start">
                        <span class="ms-2">{{ $t('itemName_' + item.id) }}</span>
                    </div>
                    <div class="col-auto">
                        <small class="text-muted">x</small>
                        <span :class="{ 'text-normal':item.count > 0, 'text-muted':item.count < 1 }"><FormatNumber :value="item.count" /></span>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'item', 'active' ],    
}
</script>