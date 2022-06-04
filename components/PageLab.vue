<template>
    <div class="col scrollbar">
        <div class="row g-3">
            <CardLab :lab="lab" />
            <CardTechs v-if="lab.game.techs['automation1'].unlocked == true" :lab="lab" />
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'lab' ],    
}
</script>