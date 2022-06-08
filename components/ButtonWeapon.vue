<template>
    <div v-if="weapon.unlocked == true" class="list-group-item list-group-item-action py-1" :class="{ 'active':active }" >
        <div class="row gx-2 align-items-center">
            <div class="col">
                <button type="button" class="w-100 btn px-0 align-items-center" @click="$emit('click')">
                    <div class="col-auto">
                        <img :src="require(`~/assets/weapons/${weapon.id}.png`)" width="18px" height="18px" :title="$t('weaponName_' + weapon.id)" :alt="$t('weaponName_' + weapon.id)" />
                    </div>
                    <div class="col text-start">
                        <span class="ms-2">{{ $t('weaponName_' + weapon.id) }}</span>
                    </div>
                    <div v-if="weapon.count > 0" class="col-auto">
                        <small class="text-uppercase text-success">Built</small>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'weapon', 'active' ],    
}
</script>