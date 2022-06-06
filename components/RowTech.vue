<template>
    <div v-if="tech.unlocked == true && (tech.count < 1 || (tech.count > 0 && tech.game.options.researchedTechs == true))" class="list-group-item">
        <div v-if="tech.count > 0 && tech.game.options.researchedTechs == true" class="row gx-2 align-items-center">
            <div class="col-auto">
                <img :src="require(`~/assets/techs/${tech.id}.png`)" width="24px" height="24px" :title="$t('techName_' + tech.id)" :alt="$t('techName_' + tech.id)" />
            </div>
            <div class="col">
                <div class="text-normal">{{ $t('techName_' + tech.id) }}</div>
                <div class="text-muted">{{ $t('techDesk_' + tech.id) }}</div>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-primary disabled">
                    <span class="text-success"><i class="fas fa-fw fa-check"></i></span>
                </button>
            </div>
        </div>
        <div v-if="tech.count < 1">
            <div class="row gx-2 align-items-center">
                <div class="col-auto">
                    <img :src="require(`~/assets/techs/${tech.id}.png`)" width="24px" height="24px" :title="$t('techName_' + tech.id)" :alt="$t('techName_' + tech.id)" />
                </div>
                <div class="col">
                    <div class="text-normal">{{ $t('techName_' + tech.id) }}</div>
                    <div class="text-muted">{{ $t('techDesk_' + tech.id) }}</div>
                </div>
            </div>
            <div class="row gx-2 align-items-center justify-content-end">
                <div class="col-auto">
                    <div class="row gx-1 align-items-center justify-content-end">
                        <div v-for="(count, itemId) in tech.getCosts()" class="col-auto">
                            <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" :title="$t('itemName_' + itemId)" >
                                <img :src="require(`~/assets/items/${itemId}.png`)" width="18px" height="18px" :alt="$t('itemName_' + itemId)" />
                                <span class="position-absolute bottom-0 end-0 fw-bold text-shadow" :class="{ 'text-danger':count > tech.game.items[itemId].count, 'text-normal':count <= tech.game.items[itemId].count }"><FormatNumber :value="count" /></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-auto">
                    <div class="text-center mb-1">
                        <span :class="{ 'text-muted':tech.canBuild() == false, 'text-normal':tech.canBuild() == true || tech.state == 'running' }"><FormatTime :value="tech.remainingSeconds" /></span>
                    </div>
                    <div class="progress" style="width:80px; height:3px;">
                        <div class="progress-bar" role="progressbar" :style="'width:' + percent + '%;'" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div class="col-auto">
                    <button v-if="tech.state != 'running'" type="button" class="btn btn-primary" :class="{ 'disabled':tech.canBuild() == false }" @click="build()">
                        <span><i class="fas fa-fw fa-plus-square"></i></span>
                    </button>
                    <button v-if="tech.state == 'running'" type="button" class="btn btn-primary" @click="cancel()">
                        <span><i class="fas fa-fw fa-times-circle"></i></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'tech' ],
    
    computed: {
    
        percent() {
            
            if (this.tech.remainingSeconds > 0) return 100 - 100 * (this.tech.remainingSeconds / this.tech.getTime())
            else return 0
        },
    },
    
    methods: {
        
        build() {
        
            this.tech.startBuilding()
        },
        
        cancel() {
        
            this.tech.cancelBuilding()
        },
    },
}
</script>