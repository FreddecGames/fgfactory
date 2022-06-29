<template>
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <div class="row gx-2">
                    <div class="col-auto">
                        <img :src="require(`~/assets/vignets/${item.id}.png`)" width="18px" height="18px" :title="$t('name_' + item.id)" :alt="$t('name_' + item.id)" />
                    </div>
                    <div class="col-auto">
                        <span>{{ $t('name_' + item.id) }}</span>
                        <small v-if="item.desc == true" class="ms-2 text-muted">{{ $t('desc_' + item.id) }}</small>
                    </div>
                    <div class="col">
                        <small class="fw-bold" :class="{ 'text-danger':item.productionLevel == 0, 'text-primary':item.productionLevel == 1, 'text-success':item.productionLevel == 2, }">{{ $t('productionState_' + item.productionLevel) }}</small>
                    </div>
                    <div class="col-auto">
                        <span :class="{ 'text-primary':item.count >= item.getMax(), 'text-muted':item.count < 1 }"><FormatNumber :value="item.count" /></span>
                        <span class="text-muted">/<FormatNumber :value="item.getMax()" /></span>
                    </div>
                </div>                
            </div>
            <div class="card-body">
                <div class="row gx-3 align-items-center justify-content-end">
                    <div v-for="(count, itemId) in item.getInputs()" class="col-auto">
                        <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" :title="$t('name_' + itemId)" >
                            <img :src="require(`~/assets/vignets/${itemId}.png`)" width="24px" height="24px" :alt="$t('name_' + itemId)" />
                            <span class="position-absolute bottom-0 end-0 fw-bold fs-medium text-shadow" :class="{ 'text-danger':count > item.game.bases[itemId].count, 'text-normal':count <= item.game.bases[itemId].count }"><FormatNumber :value="count" /></span>
                        </div>
                    </div>
                    <div v-if="item.getInputs()" class="col-auto px-0">
                        <i class="text-muted fas fa-fw fa-long-arrow-alt-right"></i>
                    </div>
                    <div class="col-auto">
                        <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" :title="$t('name_' + item.id)" >
                            <img :src="require(`~/assets/vignets/${item.id}.png`)" width="24px" height="24px" :alt="$t('name_' + item.id)" />
                            <span class="position-absolute bottom-0 end-0 fw-bold fs-medium text-shadow" :class="{ 'text-primary':item.count + output > max, 'text-normal':item.count + output <= max }" :title="$t('name_' + item.id)"><FormatNumber :value="output" /></span>
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
            <div v-if="alienEggUnlocked" class="card-body">
                <div class="row gx-3 align-items-center">
                    <div class="col-auto">
                        <small class="text-muted">Speed Production</small>
                        <span>{{ speedBonus }}%</span>
                    </div>
                    <div v-if="item.alienEggCount < 100" class="col-auto">
                        <div class="row gx-3 align-items-center">
                            <div class="col-auto">
                                <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" :title="$t('name_alienEgg')" >
                                    <img :src="require(`~/assets/vignets/alienEgg.png`)" width="18px" height="18px" :alt="$t('name_alienEgg')" />
                                    <span class="position-absolute bottom-0 end-0 fw-bold fs-medium text-shadow" :class="{ 'text-normal':alienEggCount > 0, 'text-danger':alienEggCount <= 0 }" :title="$t('name_alienEgg')"><FormatNumber :value="1" /></span>
                                </div>
                            </div>
                            <div class="col-auto px-0">
                                <i class="text-muted fas fa-fw fa-long-arrow-alt-right"></i>
                            </div>
                            <div class="col-auto">
                                <span class="text-success">+1%</span>
                            </div>
                            <div class="col-auto">
                                <button type="button" class="btn btn-sm p-1 btn-primary" :class="{ 'disabled':alienEggCount < 1 || item.alienEggCount >= 100 }" @click="addAlienEgg()">
                                    <span><i class="fas fa-fw fa-plus-square"></i></span>
                                </button>
                            </div>
                        </div>
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
        
        max() { return this.item.getMax() },
        
        output() { return this.item.getOutput() },
        
        percent() {
            
            if (this.item.remainingSeconds > 0) return 100 - 100 * (this.item.remainingSeconds / this.item.getTime())
            else return 0
        },
        
        alienEggUnlocked() { return this.item.game.techs['military1'].unlocked },
        
        alienEggCount() { return this.item.game.bases['alienEgg'].count },
        
        speedBonus() {
        
            let ret = 100
            ret += this.item.alienEggCount
            
            return ret
        },
    },
    
    methods: {
        
        run() { this.item.startProducing() },
        
        pause() { this.item.pauseProducing() },
        
        addAlienEgg() {
        
            if (this.alienEggCount > 0 && this.item.alienEggCount < 100) {
            
                this.item.alienEggCount += 1                
                this.item.remainingSeconds *= .99
                
                this.item.game.bases['alienEgg'].count -= 1
            }
        },
    },
}
</script>