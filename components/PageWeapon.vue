<template>
    <div class="col scrollbar">
        <div class="row g-3">
            <HeaderWeapon :weapon="weapon" />
            <CardWeapon v-if="weapon.count < 1" :weapon="weapon" />
            <CardAmmunitions v-if="weapon.game.ammunitions[weapon.id + 'A1'].unlocked == true" :weapon="weapon" />
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'weapon' ],    
}
</script>