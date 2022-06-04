<template>
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <div class="row gx-2">
                    <div class="col">
                        <span class="text-muted">Storage</span>
                    </div>
                </div>                
            </div>
            <div class="list-group list-group-flush">
                <RowStorage v-for="storage in item.storages" :key="storage.id" :storage="storage" />
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'item' ],
}
</script>