<template>
    <div v-if="building.unlocked == true" class="list-group-item">
        <div class="row gx-2 align-items-center">
            <div class="col-auto">
                <img :src="require(`~/assets/buildings/${building.icon}.png`)" width="24px" height="24px" :title="$t('buildingName_' + building.name)" :alt="$t('buildingName_' + building.name)" />
            </div>
            <div class="col">
                <div class="text-normal">{{ $t('buildingName_' + building.name) }}</div>
                <div>{{ $t('buildingDesc_' + building.name) }}</div>
            </div>
            <div class="col-auto">
                <span class="text-muted">x</span>
                <span class="text-normal">{{ building.count }}</span>
            </div>
        </div>
        <div class="row gx-2 align-items-center justify-content-end">
            <div class="col-auto">
                <div class="row gx-1 align-items-center justify-content-end">
                    <div v-for="(count, itemId) in building.getCosts()" class="col-auto">
                        <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" :title="$t('itemName_' + itemId)" >
                            <img :src="require(`~/assets/items/${itemId}.png`)" width="18px" height="18px" :alt="$t('itemName_' + itemId)" />
                            <span class="position-absolute bottom-0 end-0 fw-bold text-shadow" :class="{ 'text-danger':count > building.game.items[itemId].count, 'text-normal':count <= building.game.items[itemId].count }"><FormatNumber :value="count" /></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-auto">
                <div class="text-center mb-1">
                    <span :class="{ 'text-muted':building.canBuild() == false, 'text-normal':building.canBuild() == true || building.state == 'running' }"><FormatTime :value="building.remainingSeconds" /></span>
                </div>
                <div class="progress" style="width:80px; height:3px;">
                    <div class="progress-bar" role="progressbar" :style="'width:' + percent + '%;'" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
            <div class="col-auto">
                <button v-if="building.state != 'running'" type="button" class="btn btn-primary" :class="{ 'disabled':building.canBuild() == false }" @click="build()">
                    <span><i class="fas fa-fw fa-plus-square"></i></span>
                </button>
                <button v-if="building.state == 'running'" type="button" class="btn btn-primary" @click="cancel()">
                    <span><i class="fas fa-fw fa-times-circle"></i></span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'building' ],
    
    computed: {
    
        percent() {
            
            if (this.building.remainingSeconds > 0) return 100 - 100 * (this.building.remainingSeconds / this.building.getTime())
            else return 0
        },
    },
    
    methods: {
        
        build() {
        
            this.building.startBuilding()
        },
        
        cancel() {
        
            this.building.cancelBuilding()
        },
    },
}
</script>