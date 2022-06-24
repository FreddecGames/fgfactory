<template>
    <div class="col-12 mt-2">
        <div class="card">
            <div class="card-header">
                <div class="row gx-2">
                    <div class="col">
                        <span>Production</span>
                    </div>
                    <div class="col-auto">
                        <small class="fw-bold" :class="{ 'text-danger':item.productionLevel == 0, 'text-primary':item.productionLevel == 1, 'text-success':item.productionLevel == 2, }">{{ $t('productionState_' + item.productionLevel) }}</small>
                    </div>
                </div>                
            </div>
            <div class="card-body">
                <div class="row gx-1 align-items-center justify-content-end">
                    <div class="col-auto">
                        <div class="row gx-2 align-items-center justify-content-end">
                            <div v-for="(count, itemId) in item.getInputs()" class="col-auto">
                                <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" :title="$t('itemName_' + itemId)" >
                                    <img :src="require(`~/assets/items/${itemId}.png`)" width="18px" height="18px" :alt="$t('itemName_' + itemId)" />
                                    <span class="position-absolute bottom-0 end-0 fw-bold fs-medium text-shadow" :class="{ 'text-danger':count > item.game.items[itemId].count, 'text-normal':count <= item.game.items[itemId].count }"><FormatNumber :value="count" /></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="item.getInputs()" class="col-auto px-0">
                        <i class="text-muted fas fa-fw fa-long-arrow-alt-right"></i>
                    </div>
                    <div v-for="(count, itemId) in item.getOutputs()" class="col-auto ps-0">
                        <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" :title="$t('itemName_' + itemId)" >
                            <img :src="require(`~/assets/items/${itemId}.png`)" width="18px" height="18px" :alt="$t('itemName_' + itemId)" />
                            <span class="position-absolute bottom-0 end-0 fw-bold fs-medium text-shadow" :class="{ 'text-primary':item.game.items[itemId].count + count > item.game.items[itemId].getMax(), 'text-normal':item.game.items[itemId].count + count <= item.game.items[itemId].getMax() }" :title="$t('itemName_' + itemId)"><FormatNumber :value="count" /></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="text-center mb-1">
                            <span :class="{ 'text-muted':item.productionLevel < 1, 'text-normal':item.productionLevel > 0 }"><FormatTime :value="item.remainingSeconds" /></span>
                        </div>
                        <div class="progress" style="width:70px; height:3px;">
                            <div class="progress-bar" role="progressbar" :style="'width:' + percent + '%;'" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <button v-if="item.state == 'paused'" type="button" class="btn btn-primary" :class="{ 'disabled':item.productionLevel < 1 }" @click="run()">
                            <span><i class="fas fa-fw fa-play"></i></span>
                        </button>
                        <button v-if="item.state != 'paused'" type="button" class="btn btn-primary" @click="pause()">
                            <span :class="{ 'text-danger':item.state == 'waiting' && item.count < item.getMax(), 'text-primary':item.state == 'waiting' && item.count >= item.getMax() }"><i class="fas fa-fw fa-stop"></i></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'item' ],
    
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