<template>
    <div class="list-group-item list-group-item-action py-1" :class="{ 'active':active }" >
        <div class="row gx-2 align-items-center">
            <div class="col">
                <button type="button" class="w-100 btn px-0 align-items-center" @click="$emit('click')">
                    <div class="col-auto">
                        <img :src="require(`~/assets/attack/fight.png`)" width="18px" height="18px" :title="$t('attackName_fight')" :alt="$t('attackName_fight')" />
                    </div>
                    <div class="col text-start">
                        <span class="ms-2">{{ $t('attackName_fight') }}</span>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'active' ],    
}
</script>