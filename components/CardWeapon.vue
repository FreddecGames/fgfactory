<template>
    <div class="col-12 mt-2">
        <div class="card">
            <div class="card-body">
                <div class="row gx-1 align-items-center justify-content-end">
                    <div class="col-auto">
                        <div class="row gx-2 align-items-center justify-content-end">
                            <div v-for="(count, itemId) in weapon.getCosts()" class="col-auto">
                                <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" :title="$t('itemName_' + itemId)" >
                                    <img :src="require(`~/assets/items/${itemId}.png`)" width="18px" height="18px" :alt="$t('itemName_' + itemId)" />
                                    <span class="position-absolute bottom-0 end-0 fw-bold fs-medium text-shadow" :class="{ 'text-danger':count > weapon.game.items[itemId].count, 'text-normal':count <= weapon.game.items[itemId].count }"><FormatNumber :value="count" /></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="text-center mb-1">
                            <span :class="{ 'text-muted':weapon.productionLevel < 1, 'text-normal':weapon.productionLevel > 0 }"><FormatTime :value="weapon.remainingSeconds" /></span>
                        </div>
                        <div class="progress" style="width:70px; height:3px;">
                            <div class="progress-bar" role="progressbar" :style="'width:' + percent + '%;'" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <button v-if="weapon.state == 'paused'" type="button" class="btn btn-primary" :class="{ 'disabled':weapon.productionLevel < 1 }" @click="run()">
                            <span><i class="fas fa-fw fa-plus-square"></i></span>
                        </button>
                        <button v-if="weapon.state != 'paused'" type="button" class="btn btn-primary" @click="pause()">
                            <span :class="{ 'text-danger':weapon.state == 'waiting' }"><i class="fas fa-fw fa-times-circle"></i></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'weapon' ],
    
    computed: {
    
        percent() {
            
            if (this.weapon.remainingSeconds > 0) return 100 - 100 * (this.weapon.remainingSeconds / this.weapon.getTime())
            else return 0
        },
    },
    
    methods: {
        
        run() {
        
            this.weapon.startBuilding()
        },
        
        pause() {
        
            this.weapon.cancelBuilding()
        },
    },
}
</script>