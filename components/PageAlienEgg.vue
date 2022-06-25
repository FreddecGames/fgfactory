<template>
    <div class="col scrollbar">
        <div class="row g-3">
            <CardAliens :item="item" />
            <div v-if="item.game.getWeaponCount() < 1" class="col-12">
                <span class="text-muted">To collect Alien Eggs you have to build weapons.</span>
            </div>
            <CardArsenal v-if="item.game.getWeaponCount() >= 1" :weapons="item.game.weapons" />
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'item' ],    
}
</script>