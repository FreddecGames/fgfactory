<template>
    <div v-if="ammunition.unlocked == true" class="list-group-item">
        <div class="row gx-2 align-items-center">
            <div class="col-auto">
                <img :src="require(`~/assets/items/${ammunition.icon}.png`)" width="24px" height="24px" :title="$t('ammunitionName_' + ammunition.name)" :alt="$t('ammunitionName_' + ammunition.name)" />
            </div>
            <div class="col">
                <div class="text-normal">{{ $t('ammunitionName_' + ammunition.name) }}</div>
                <div>{{ $t('ammunitionDesc_' + ammunition.name) }}</div>
            </div>
            <div class="col-auto">
                <span class="text-muted">x</span>
                <span class="text-normal">{{ ammunition.count }}</span>
            </div>
        </div>
        <div class="row gx-1 align-items-center justify-content-end">
            <div class="col-auto">
                <div class="row gx-2 align-items-center justify-content-end">
                    <div v-for="(count, itemId) in ammunition.getCosts()" class="col-auto">
                        <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" :title="$t('itemName_' + itemId)" >
                            <img :src="require(`~/assets/items/${itemId}.png`)" width="18px" height="18px" :alt="$t('itemName_' + itemId)" />
                            <span class="position-absolute bottom-0 end-0 fw-bold fs-medium text-shadow" :class="{ 'text-danger':count > ammunition.game.items[itemId].count, 'text-normal':count <= ammunition.game.items[itemId].count }"><FormatNumber :value="count" /></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-auto">
                <div class="text-center mb-1">
                    <span :class="{ 'text-muted':ammunition.canBuild() == false, 'text-normal':ammunition.canBuild() == true || ammunition.state == 'running' }"><FormatTime :value="ammunition.remainingSeconds" /></span>
                </div>
                <div class="progress" style="width:70px; height:3px;">
                    <div class="progress-bar" role="progressbar" :style="'width:' + percent + '%;'" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
            <div class="col-auto">
                <button v-if="ammunition.state != 'running'" type="button" class="btn btn-primary" :class="{ 'disabled':ammunition.canBuild() == false }" @click="build()">
                    <span><i class="fas fa-fw fa-plus-square"></i></span>
                </button>
                <button v-if="ammunition.state == 'running'" type="button" class="btn btn-primary" @click="cancel()">
                    <span><i class="fas fa-fw fa-times-circle"></i></span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'ammunition' ],
    
    computed: {
    
        percent() {
            
            if (this.ammunition.remainingSeconds > 0) return 100 - 100 * (this.ammunition.remainingSeconds / this.ammunition.getTime())
            else return 0
        },
    },
    
    methods: {
        
        build() {
        
            this.ammunition.startBuilding()
        },
        
        cancel() {
        
            this.ammunition.cancelBuilding()
        },
    },
}
</script>