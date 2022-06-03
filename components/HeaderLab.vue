<template>
    <div class="col-12">
        <div class="row gx-2 align-items-center">
            <div class="col-auto">
                <img :src="require(`~/assets/lab/${lab.id}.png`)" width="18px" height="18px" :title="$t('labName_' + lab.id)" :alt="$t('labName_' + lab.id)" />
            </div>
            <div class="col">
                <span class="h5">{{ $t('labName_' + lab.id) }}</span>
            </div>
            <div class="col-auto">
                <span :class="{ 'text-normal':lab.count > 0, 'text-muted':lab.count < 1 }"><FormatNumber :value="lab.count" /></span>
                <span class="text-muted">(<span :class="{ 'text-muted':lab.getUsedCount() < 1, 'text-primary':lab.getUsedCount() > 0 }">{{ lab.getUsedCount() }}</span>)</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'lab' ],    
}
</script>