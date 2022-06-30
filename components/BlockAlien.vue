<template>
    <div v-if="alien.count > 0" class="col-auto">
        <div class="position-relative rounded d-flex align-items-center justify-content-center" :title="$t('alien_' + alien.id)" >
            <img :src="require(`~/assets/aliens/${alien.id}.png`)" width="48px" height="48px" :alt="$t('alien_' + alien.id)" />
            <span class="position-absolute top-0 end-0 fw-bold fs-medium text-shadow ext-normal"><FormatNumber :value="alien.count" /></span>
            <div class="w-100 position-absolute progress" style="bottom:-1px; left:0; height:3px; border-radius: 0 0 6px 6px;">
                <div class="progress-bar" role="progressbar" :style="'width:' + percent + '%;'" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'alien' ],
    
    computed: {
    
        percent() {
            
            let count = this.alien.count - 1
            
            let ret = 100 * (this.alien.totalHealth - (this.alien.health * count)) / this.alien.health
            return ret
        },
    },
}
</script>