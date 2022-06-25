<template>
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <div class="row gx-2">
                    <div class="col-auto">
                        <img :src="require(`~/assets/storages/${storage.icon}.png`)" width="18px" height="18px" :title="$t('storageName_' + storage.name)" :alt="$t('storageName_' + storage.name)" />
                    </div>
                    <div class="col">
                        <span>{{ $t('storageName_' + storage.name) }}</span>
                        <small class="ms-2 text-muted">{{ $t('storageDesc_' + storage.name) }}</small>
                    </div>
                    <div class="col-auto">
                        <small class="text-muted">x</small>
                        <span>{{ storage.count }}</span>
                    </div>
                </div>                
            </div>
            <div class="card-body">
                <div class="row gx-2 align-items-center justify-content-end">
                    <div v-for="(count, itemId) in storage.getCosts()" class="col-auto">
                        <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" :title="$t('itemName_' + itemId)" >
                            <img :src="require(`~/assets/items/${itemId}.png`)" width="24px" height="24px" :alt="$t('itemName_' + itemId)" />
                            <span class="position-absolute bottom-0 end-0 fw-bold fs-medium text-shadow" :class="{ 'text-danger':count > storage.game.items[itemId].count, 'text-normal':count <= storage.game.items[itemId].count }"><FormatNumber :value="count" /></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="text-center mb-1">
                            <span :class="{ 'text-muted':storage.canBuild() == false, 'text-normal':storage.canBuild() == true || storage.state == 'running' }"><FormatTime :value="storage.remainingSeconds" /></span>
                        </div>
                        <div class="progress" style="width:70px; height:3px;">
                            <div class="progress-bar" role="progressbar" :style="'width:' + percent + '%;'" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <button v-if="storage.state != 'running'" type="button" class="btn btn-primary" :class="{ 'disabled':storage.canBuild() == false }" @click="build()">
                            <span><i class="fas fa-fw fa-plus-square"></i></span>
                        </button>
                        <button v-if="storage.state == 'running'" type="button" class="btn btn-primary" @click="cancel()">
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

    props: [ 'storage' ],
    
    computed: {
    
        percent() {
            
            if (this.storage.remainingSeconds > 0) return 100 - 100 * (this.storage.remainingSeconds / this.storage.getTime())
            else return 0
        },
    },
    
    methods: {
        
        build() {
        
            this.storage.startBuilding()
        },
        
        cancel() {
        
            this.storage.cancelBuilding()
        },
    },
}
</script>