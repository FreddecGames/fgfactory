<template>
    <div v-if="alien.count > 0" class="col-auto">
        <div class="position-relative rounded d-flex align-items-center justify-content-center" :title="$t('alienName_' + alien.id)" >
            <img :src="require(`~/assets/aliens/${alien.id}.png`)" width="48px" height="48px" :alt="$t('alienName_' + alien.id)" />
            <span class="position-absolute bottom-0 end-0 fw-bold fs-medium text-shadow ext-normal"><FormatNumber :value="alien.count" /></span>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'alien' ],    
}
</script>