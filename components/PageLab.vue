<template>
    <div class="col scrollbar">
        <div class="row g-3">
            <CardBuildable :buildable="lab" />
            <CardAvailableTechs v-if="lab.game.techs['automation1'].unlocked == true" :lab="lab" />
            <CardDoneTechs v-if="lab.game.techs['automation1'].count > 0 && lab.game.options.researchedTechs == true" :lab="lab" />
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'lab' ],    
}
</script>