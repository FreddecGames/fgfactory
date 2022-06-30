<template>
    <div v-if="item.unlocked == true" class="col-12">
        <div class="list-group-item list-group-item-action py-0" :class="{ 'active':active }">
            <div class="row gx-2 align-items-center">
                <div class="col">
                    <button type="button" class="w-100 btn px-0 align-items-center" @click="$emit('click')">
                        <div class="col-auto">
                            <img :src="require(`~/assets/vignets/${item.id}.png`)" width="18px" height="18px" :title="$t('name_' + item.id)" :alt="$t('name_' + item.id)" />
                        </div>
                        <div class="col text-start">
                            <span class="ms-2">{{ $t('name_' + item.id) }}</span>
                        </div>
                        <div class="col-auto">
                            <small class="text-muted">x</small>
                            <span :class="{ 'text-full':item.count >= max, 'text-normal':item.count > 0 && item.count < max, 'text-muted':item.count < 1 }"><FormatNumber :value="item.count" /></span>
                            <small class="text-muted">/<FormatNumber :value="max" /></small>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'item', 'active' ],
    
    computed: {
    
        max() { return this.item.game.getAlienEggMax() },
    },
}
</script>