<template>
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <div class="row gx-2">
                    <div class="col">
                        <span class="text-muted">Building</span>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="row gx-2 align-items-center">
                    <div class="col-auto">
                        <img :src="require(`~/assets/lab/${lab.id}.png`)" width="24px" height="24px" :title="$t('labName_' + lab.id)" :alt="$t('labName_' + lab.id)" />
                    </div>
                    <div class="col">
                        <div class="text-normal">{{ $t('labName_' + lab.id) }}</div>
                        <div class="text-muted">{{ $t('labDesc_' + lab.id) }}</div>
                    </div>
                    <div class="col-auto">
                        <span class="text-muted">x</span>
                        <span class="text-normal">{{ lab.count }}</span>
                    </div>
                </div>
                <div class="row gx-1 align-items-center justify-content-end">
                    <div class="col-auto">
                        <div class="row gx-2 align-items-center justify-content-end">
                            <div v-for="(count, itemId) in lab.getCosts()" class="col-auto">
                                <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" :title="$t('itemName_' + itemId)" >
                                    <img :src="require(`~/assets/items/${itemId}.png`)" width="18px" height="18px" :alt="$t('itemName_' + itemId)" />
                                    <span class="position-absolute bottom-0 end-0 fw-bold fs-medium text-shadow" :class="{ 'text-danger':count > lab.game.items[itemId].count, 'text-normal':count <= lab.game.items[itemId].count }" style="white-space:nowrap;"><FormatNumber :value="count" /></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="text-center mb-1">
                            <span :class="{ 'text-muted':lab.canBuild() == false, 'text-normal':lab.canBuild() == true || lab.state == 'running' }"><FormatTime :value="lab.remainingSeconds" /></span>
                        </div>
                        <div class="progress" style="width:70px; height:3px;">
                            <div class="progress-bar" role="progressbar" :style="'width:' + percent + '%;'" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <button type="button" class="btn btn-primary" :class="{ 'disabled':lab.canBuild() == false || lab.state == 'running' }" @click="build()">
                            <span><i class="fas fa-fw fa-plus-square"></i></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'lab' ],
    
    computed: {
    
        percent() {
            
            if (this.lab.remainingSeconds > 0) return 100 - 100 * (this.lab.remainingSeconds / this.lab.getTime())
            else return 0
        },
    },
    
    methods: {
        
        build() {
        
            this.lab.startBuilding()
        },
    },
}
</script>