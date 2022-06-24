<template>
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <div class="row gx-2">
                    <div class="col">
                        <span>Arsenal</span>
                    </div>
                </div>                
            </div>
            <div class="list-group list-group-flush">
                <RowWeapon v-for="weapon in weapons" :key="weapon.id" :weapon="weapon" />
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'weapons' ],
}
</script>