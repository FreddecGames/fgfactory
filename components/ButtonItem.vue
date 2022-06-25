<template>
    <div v-if="item.unlocked == true" class="col-4">
        <div class="list-group-item list-group-item-action py-0 px-1" :class="{ 'active':active }" >
            <div class="row gx-2 align-items-center">
                <div class="col">
                    <button type="button" class="w-100 position-relative btn py-0 px-2 align-items-center justify-content-center" @click="$emit('click')">
                        <img :src="require(`~/assets/items/${item.id}.png`)" width="28px" height="28px" :title="$t('itemName_' + item.id)" :alt="$t('itemName_' + item.id)" />
                        <div class="position-absolute start-0 top-n1 small">
                            <span class="fw-bold text-shadow" :class="{ 'text-muted':prod == 0, 'text-success':prod > 0, 'text-danger':prod < 0 }"><span v-if="prod > 0">+</span><FormatNumber :value="prod" /> <small>/s</small></span>
                        </div>
                        <div class="position-absolute end-0 bottom-n1 small">
                            <span class="fw-bold text-shadow" :class="{ 'text-muted':item.count <= 0, 'text-normal':item.count > 0 && item.count < item.getMax(), 'text-primary':item.count >= item.getMax() }"><FormatNumber :value="item.count" /></span>
                            <small class="text-muted fw-bold text-shadow">/<FormatNumber :value="item.getMax()" /></small>
                        </div>
                    </button>
                </div>
                <div class="col-auto py-1">
                    <button v-if="item.state == 'paused'" type="button" class="btn btn-primary" :class="{ 'disabled':item.productionLevel < 1 }" @click="run()">
                        <span><i class="fas fa-fw fa-play"></i></span>
                    </button>
                    <button v-if="item.state != 'paused'" type="button" class="position-relative btn btn-primary" @click="pause()">
                        <span :class="{ 'text-danger':item.state == 'waiting' && item.count < item.getMax(), 'text-primary':item.state == 'waiting' && item.count >= item.getMax() }"><i class="fas fa-fw fa-stop"></i></span>
                        <div class="w-100 position-absolute progress" style="bottom:-1px; left:0; height:3px; border-radius: 0 0 6px 6px;">
                            <div class="progress-bar" role="progressbar" :style="'width:' + percent + '%;'" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
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
    
        percent() {
            
            if (this.item.remainingSeconds > 0) return 100 - 100 * (this.item.remainingSeconds / this.item.getTime())
            else return 0
        },
        
        prod() {
            
            let ret = 0
            for (let id in this.item.game.items) {
                let item = this.item.game.items[id]
                if (item.state == 'running') {
                    
                    let time = item.getTime()
                    
                    let inputs = item.getInputs()
                    if (inputs != null) {
                        for (let inputId in inputs) {
                            if (inputId == this.item.id) {                            
                                ret -= inputs[inputId] / time
                            }
                        }
                    }
                    
                    let outputs = item.getOutputs()
                    if (outputs != null) {
                        for (let outputId in outputs) {
                            if (outputId == this.item.id) {                            
                                ret += outputs[outputId] / time
                            }
                        }
                    }
                }
            }
            
            return ret
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