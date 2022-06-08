<template>
    <div class="col-12">
        <div class="row gx-2 align-items-center">
            <div class="col-auto">
                <img :src="require(`~/assets/weapons/${weapon.id}.png`)" width="18px" height="18px" :title="$t('weaponName_' + weapon.id)" :alt="$t('weaponName_' + weapon.id)" />
            </div>
            <div class="col">
                <span class="h5">{{ $t('weaponName_' + weapon.id) }}</span>
            </div>
            <div v-if="weapon.count > 0" class="col-auto">
                <small class="text-uppercase text-success">Built</small>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'weapon' ],    
}
</script>