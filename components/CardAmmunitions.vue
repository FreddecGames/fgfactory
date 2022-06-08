<template>
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <div class="row gx-2">
                    <div class="col">
                        <span class="text-muted">Ammunitions</span>
                    </div>
                    <div class="col-auto">
                        <span class="badge bg-1 text-primary">{{ $t('productionState_1') }}</span>
                    </div>
                </div>                
            </div>
            <div class="list-group list-group-flush">
                <RowAmmunition v-for="ammunition in weapon.ammunitions" :key="ammunition.id" :ammunition="ammunition" />
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'weapon' ],
}
</script>