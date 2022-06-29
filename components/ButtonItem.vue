<template>
    <div v-if="item.unlocked == true" class="col-12 col-lg-6 col-xl-4 col-xxl-3">
        <div class="list-group-item list-group-item-action py-0 px-1" :class="{ 'active':active }">
            <div class="row gx-1 align-items-center">
                <div class="col">
                    <button type="button" class="w-100 position-relative btn py-1 px-0 align-items-center justify-content-start" @click="$emit('click')">
                        <div class="col-auto pe-2">
                            <img :src="require(`~/assets/vignets/${item.id}.png`)" width="24px" height="24px" :title="$t('name_' + item.id)" :alt="$t('name_' + item.id)" class="my-1" />
                        </div>
                        <div class="col-auto small text-start">
                            <span class="fw-bold text-shadow" :class="{ 'text-muted':prod == 0, 'text-success':prod > 0, 'text-danger':prod < 0 }"><span v-if="prod > 0">+</span><FormatNumber :value="prod" /> <small>/s</small></span>
                            <div class="">
                                <span class="fw-bold text-shadow" :class="{ 'text-muted':item.count <= 0, 'text-normal':item.count > 0 && item.count < item.getMax(), 'text-primary':item.count >= item.getMax() }"><FormatNumber :value="item.count" /></span>
                                <small class="text-muted fw-bold text-shadow">/<FormatNumber :value="item.getMax()" /></small>
                            </div>
                        </div>
                    </button>
                </div>
                <div v-if="item.game.options.startStopShortcut" class="col-auto">
                    <button v-if="item.state == 'paused'" type="button" class="btn btn-sm p-1 btn-primary" :class="{ 'disabled':item.productionLevel < 1 }" @click="run()">
                        <span><i class="fas fa-fw fa-play"></i></span>
                    </button>
                    <button v-if="item.state != 'paused'" type="button" class="position-relative btn btn-sm p-1 btn-primary" @click="pause()">
                        <span :class="{ 'text-danger':item.state == 'waiting' && item.count < item.getMax(), 'text-primary':item.state == 'waiting' && item.count >= item.getMax() }"><i class="fas fa-fw fa-stop"></i></span>
                        <div class="w-100 position-absolute progress" style="bottom:-1px; left:0; height:3px; border-radius: 0 0 6px 6px;">
                            <div class="progress-bar" role="progressbar" :style="'width:' + percent + '%;'" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </button>
                </div>
                <div v-if="item.game.options.upgradeStorageShortcut && item.storage.unlocked == true" class="col-auto">
                    <button v-if="item.storage.state != 'running'" type="button" class="btn btn-sm p-1 btn-primary" :class="{ 'disabled':item.storage.canBuild() == false }" @click="build()">
                        <span><i class="fas fa-fw fa-level-up-alt"></i></span>
                    </button>
                    <button v-if="item.storage.state == 'running'" type="button" class="btn btn-sm p-1 btn-primary" @click="cancel()">
                        <span><i class="fas fa-fw fa-times-circle"></i></span>
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
        
        prod() { return this.item.getProd() },
    },
    
    methods: {
        
        run() { this.item.startProducing() },
        
        pause() { this.item.pauseProducing() },
        
        build() { this.item.storage.startBuilding() },
        
        cancel() { this.item.storage.cancelBuilding() },
    },
}
</script>