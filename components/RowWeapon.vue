<template>
    <div v-if="weapon.unlocked == true && weapon.count >= 1" class="list-group-item">
        <div class="row gx-2 align-items-center">
            <div class="col-auto">
                <img :src="require(`~/assets/weapons/${weapon.id}.png`)" width="24px" height="24px" :title="$t('weaponName_' + weapon.id)" :alt="$t('weaponName_' + weapon.id)" />
            </div>
            <div class="col">
                <div class="text-normal">{{ $t('weaponName_' + weapon.id) }}</div>
            </div>
            <div class="col-auto">
                <div class="row gx-2 align-items-center justify-content-end">
                    <div v-for="ammunition in weapon.ammunitions" :key="ammunition.id" class="col-auto">
                        <div class="position-relative rounded d-flex align-items-center justify-content-center" style="width:28px; height:28px;" title="Shots" >
                            <img :src="require(`~/assets/bullet.png`)" width="14px" height="14px" alt="Shots" />
                            <span class="position-absolute bottom-0 end-0 fw-bold fs-medium text-shadow" :class="{ 'text-normal':ammunition.remainingShot > 0, 'text-danger':ammunition.remainingShot < 1, }"><FormatNumber :value="ammunition.remainingShot" /></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-auto">
                <div class="text-center mb-1">
                    <span :class="{ 'text-muted':weapon.canFire() == false, 'text-normal':weapon.canFire() == true || weapon.fireState == 'running' }"><FormatTime :value="weapon.fireRemainingSeconds" /></span>
                </div>
                <div class="progress" style="width:70px; height:3px;">
                    <div class="progress-bar" role="progressbar" :style="'width:' + percent + '%;'" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
            <div class="col-auto">
                <button v-if="weapon.fireState != 'running'" type="button" class="btn btn-primary" :class="{ 'disabled':weapon.canFire() == false }" @click="fire()">
                    <span><i class="fas fa-fw fa-dot-circle"></i></span>
                </button>
                <button v-if="weapon.fireState == 'running'" type="button" class="btn btn-primary" @click="cancel()">
                    <span><i class="fas fa-fw fa-stop"></i></span>
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
            
            if (this.weapon.fireRemainingSeconds > 0) return 100 - 100 * (this.weapon.fireRemainingSeconds / this.weapon.getFireTime())
            else return 0
        },
    },
    
    methods: {
        
        fire() {
        
            this.weapon.startFiring()
        },
        
        cancel() {
        
            this.weapon.cancelFiring()
        },
    },
}
</script>