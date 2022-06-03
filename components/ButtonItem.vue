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
                        <span :class="{ 'text-muted':item.count <= 0, 'text-normal':item.count > 0 && item.count < item.getMax(), 'text-danger':item.count >= item.getMax() }"><FormatNumber :value="item.count" /></span>
                        <span class="text-muted">/<FormatNumber :value="item.getMax()" /></span>
                    </div>
                </button>
            </div>
            <div class="col-auto">
                <button v-if="item.state == 'paused'" type="button" class="btn btn-primary" :class="{ 'disabled':item.productionLevel < 1 }" @click="run()">
                    <span><i class="fas fa-fw fa-play"></i></span>
                </button>
                <button v-if="item.state != 'paused'" type="button" class="position-relative btn btn-primary" @click="pause()">
                    <span :class="{ 'text-danger':item.state == 'waiting' }"><i class="fas fa-fw fa-pause"></i></span>
                    <div class="w-100 position-absolute progress" style="bottom:-1px; left:0; height:3px; border-radius: 0 0 6px 6px;">
                        <div class="progress-bar" role="progressbar" :style="'width:' + percent + '%;'" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'item', 'active' ],
    
    computed: {
    
        percent() {
            
            if (this.item.remainingSeconds > 0) return 100 - 100 * (this.item.remainingSeconds / this.item.getTime())
            else return 0
        },
    },
    
    methods: {
        
        run() {
        
            this.item.startProducing()
        },
        
        pause() {
        
            this.item.pauseProducing()
        },
    },
}
</script>