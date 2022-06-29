<template>
    <div v-if="weapon.unlocked == true" class="list-group-item">
        <div v-if="weapon.count >= 1" class="row gx-3 align-items-center">
            <div class="col-auto">
                <img :src="require(`~/assets/vignets/${weapon.id}.png`)" width="24px" height="24px" :title="$t('name_' + weapon.id)" :alt="$t('name_' + weapon.id)" />
            </div>
            <div class="col">
                <div class="text-normal">
                    {{ $t('name_' + weapon.id) }}
                    <small class="ms-2 text-success fw-bold">Built</small>
                </div>
                <div class="small">{{ $t('desc_' + weapon.id) }}</div>
            </div>
            <div class="col-auto">
                <div class="row gx-3 align-items-center">
                    <div v-for="ammunition in ammunitions" class="col-auto">
                        <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" :title="$t('name_' + ammunition.id)" >
                            <img :src="require(`~/assets/vignets/${ammunition.id}.png`)" width="24px" height="24px" :alt="$t('name_' + ammunition.id)" />
                            <span class="position-absolute bottom-0 end-0 fw-bold fs-medium text-shadow text-normal"><FormatNumber :value="ammunition.count" /></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-auto">
                <div class="text-center mb-1">
                    <span :class="{ 'text-muted':weapon.canFire() == false, 'text-normal':weapon.canFire() == true || weapon.fireState == 'running' }"><FormatTime :value="weapon.fireRemainingSeconds" /></span>
                </div>
                <div class="progress" style="width:70px; height:3px;">
                    <div class="progress-bar" role="progressbar" :style="'width:' + percentFire + '%;'" :aria-valuenow="percentFire" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
            <div class="col-auto">
                <button v-if="weapon.fireState != 'running'" type="button" class="btn btn-primary" :class="{ 'disabled':weapon.canFire() == false }" @click="fire()">
                    <span><i class="fas fa-fw fa-play"></i></span>
                </button>
                <button v-if="weapon.fireState == 'running'" type="button" class="btn btn-primary" @click="cancel()">
                    <span><i class="fas fa-fw fa-stop"></i></span>
                </button>
            </div>
        </div>
        <div v-if="weapon.count < 1" class="row gx-3 align-items-center justify-content-end">
            <div class="col-auto">
                <img :src="require(`~/assets/vignets/${weapon.id}.png`)" width="24px" height="24px" :title="$t('name_' + weapon.id)" :alt="$t('name_' + weapon.id)" />
            </div>
            <div class="col">
                <div class="text-normal">{{ $t('name_' + weapon.id) }}</div>
                <div class="small">{{ $t('desc_' + weapon.id) }}</div>
            </div>
            <div class="col-auto">
                <div class="row gx-3 align-items-center justify-content-end">
                    <div v-for="(count, itemId) in weapon.getCosts()" class="col-auto">
                        <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" :title="$t('name_' + itemId)" >
                            <img :src="require(`~/assets/vignets/${itemId}.png`)" width="24px" height="24px" :alt="$t('name_' + itemId)" />
                            <span class="position-absolute bottom-0 end-0 fw-bold fs-medium text-shadow" :class="{ 'text-danger':count > weapon.game.items[itemId].count, 'text-normal':count <= weapon.game.items[itemId].count }"><FormatNumber :value="count" /></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-auto">
                <div class="text-center mb-1">
                    <span :class="{ 'text-muted':weapon.canBuild() == false, 'text-normal':weapon.canBuild() == true || weapon.state == 'running' }"><FormatTime :value="weapon.remainingSeconds" /></span>
                </div>
                <div class="progress" style="width:70px; height:3px;">
                    <div class="progress-bar" role="progressbar" :style="'width:' + percent + '%;'" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
            <div class="col-auto">
                <button v-if="weapon.state == 'paused'" type="button" class="btn btn-primary" :class="{ 'disabled':weapon.canBuild() == false }" @click="run()">
                    <span><i class="fas fa-fw fa-plus-square"></i></span>
                </button>
                <button v-if="weapon.state != 'paused'" type="button" class="btn btn-primary" @click="pause()">
                    <span :class="{ 'text-danger':weapon.state == 'waiting' }"><i class="fas fa-fw fa-times-circle"></i></span>
                </button>
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
        
        percentFire() {
            
            if (this.weapon.fireRemainingSeconds > 0) return 100 - 100 * (this.weapon.fireRemainingSeconds / this.weapon.getFireTime())
            else return 0
        },
        
        ammunitions() {
        
            let ret = []
            
            for (let id in this.weapon.ammunitions) {
                let ammunition = this.weapon.ammunitions[id]
                if (ammunition.count > 0) {
                    ret.push(ammunition)
                }
            }
            
            return ret
        },
    },
    
    methods: {
        
        run() {
        
            this.weapon.startBuilding()
        },
        
        pause() {
        
            this.weapon.cancelBuilding()
        },
        
        fire() {
        
            this.weapon.startFiring()
        },
        
        cancel() {
        
            this.weapon.cancelFiring()
        },
    },
}
</script>