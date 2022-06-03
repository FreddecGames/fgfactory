<template>
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <div class="row gx-2">
                    <div class="col">
                        <span class="text-muted">Buildings</span>
                    </div>
                </div>                
            </div>
            <div class="list-group list-group-flush">
                <RowBuilding v-for="building in item.buildings" :key="building.id" :building="building" />
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'item' ],
}
</script>