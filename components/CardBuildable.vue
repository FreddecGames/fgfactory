<template>
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <div class="row gx-2">
                    <div class="col-auto">
                        <img :src="require(`~/assets/vignets/${buildable.icon}.png`)" width="18px" height="18px" :title="$t('name_' + buildable.name)" :alt="$t('name_' + buildable.name)" />
                    </div>
                    <div class="col">
                        <span>{{ $t('name_' + buildable.name) }}</span>
                        <small class="ms-2 text-muted">{{ $t('desc_' + buildable.name) }}</small>
                    </div>
                    <div class="col-auto">
                        <small class="text-muted">x</small>
                        <span>{{ buildable.count }}</span>
                    </div>
                </div>                
            </div>
            <div class="card-body">
                <div class="row gx-2 align-items-center justify-content-end">
                    <div v-for="(count, itemId) in buildable.getCosts()" class="col-auto">
                        <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" :title="$t('name_' + itemId)" >
                            <img :src="require(`~/assets/vignets/${itemId}.png`)" width="24px" height="24px" :alt="$t('name_' + itemId)" />
                            <span class="position-absolute bottom-0 end-0 fw-bold fs-medium text-shadow" :class="{ 'text-danger':count > buildable.game.bases[itemId].count, 'text-normal':count <= buildable.game.bases[itemId].count }"><FormatNumber :value="count" /></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="text-center mb-1">
                            <span :class="{ 'text-muted':buildable.canBuild() == false, 'text-normal':buildable.canBuild() == true || buildable.state == 'running' }"><FormatTime :value="buildable.remainingSeconds" /></span>
                        </div>
                        <div class="progress" style="width:70px; height:3px;">
                            <div class="progress-bar" role="progressbar" :style="'width:' + percent + '%;'" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <button v-if="buildable.state != 'running'" type="button" class="btn btn-primary" :class="{ 'disabled':buildable.canBuild() == false }" @click="build()">
                            <span><i class="fas fa-fw fa-plus-square"></i></span>
                        </button>
                        <button v-if="buildable.state == 'running'" type="button" class="btn btn-primary" @click="cancel()">
                            <span><i class="fas fa-fw fa-times-circle"></i></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'buildable' ],
    
    computed: {
    
        percent() {
            
            if (this.buildable.remainingSeconds > 0) return 100 - 100 * (this.buildable.remainingSeconds / this.buildable.getTime())
            else return 0
        },
    },
    
    methods: {
        
        build() {
        
            this.buildable.startBuilding()
        },
        
        cancel() {
        
            this.buildable.cancelBuilding()
        },
    },
}
</script>