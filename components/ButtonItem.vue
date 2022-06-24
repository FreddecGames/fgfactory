<template>
    <div v-if="item.unlocked == true" class="list-group-item list-group-item-action py-1" :class="{ 'active':active }" >
        <div class="row gx-2 align-items-center">
            <div class="col">
                <button type="button" class="w-100 btn p-0 align-items-center" @click="$emit('click')">
                    <div class="col-12">
                        <div class="row gx-2 align-items-center">
                            <div class="col-auto">
                                <img :src="require(`~/assets/items/${item.id}.png`)" width="18px" height="18px" :title="$t('itemName_' + item.id)" :alt="$t('itemName_' + item.id)" />
                            </div>
                            <div class="col text-start">
                                <span>{{ $t('itemName_' + item.id) }}</span>
                            </div>
                            <div class="col-auto small">
                                <span :class="{ 'text-muted':prod == 0, 'text-success':prod > 0, 'text-danger':prod < 0 }"><span v-if="prod > 0">+</span><FormatNumber :value="prod" /> <small>/s</small></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="row gx-2 align-items-center">
                            <div class="col text-end">
                                <span :class="{ 'text-muted':item.count <= 0, 'text-normal':item.count > 0 && item.count < item.getMax(), 'text-danger':item.count >= item.getMax() }"><FormatNumber :value="item.count" /></span>
                                <span class="text-muted">/<FormatNumber :value="item.getMax()" /></span>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
            <div class="col-auto">
                <button v-if="item.state == 'paused'" type="button" class="btn btn-primary" :class="{ 'disabled':item.productionLevel < 1 }" @click="run()">
                    <span><i class="fas fa-fw fa-play"></i></span>
                </button>
                <button v-if="item.state != 'paused'" type="button" class="position-relative btn btn-primary" @click="pause()">
                    <span :class="{ 'text-danger':item.state == 'waiting' }"><i class="fas fa-fw fa-stop"></i></span>
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