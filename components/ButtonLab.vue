<template>
    <div v-if="lab.unlocked == true" class="list-group-item list-group-item-action py-1" :class="{ 'active':active }" >
        <div class="row gx-2 align-items-center">
            <div class="col">
                <button type="button" class="w-100 btn px-0 align-items-center" @click="$emit('click')">
                    <div class="col-auto">
                        <img :src="require(`~/assets/lab/${lab.id}.png`)" width="18px" height="18px" :title="$t('labName_' + lab.id)" :alt="$t('labName_' + lab.id)" />
                    </div>
                    <div class="col text-start">
                        <span class="ms-2">{{ $t('labName_' + lab.id) }}</span>
                    </div>
                    <div class="col-auto">
                        <small class="text-muted">x</small>
                        <span :class="{ 'text-normal':lab.count > 0, 'text-muted':lab.count < 1 }"><FormatNumber :value="lab.count" /></span>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'lab', 'active' ],    
}
</script>