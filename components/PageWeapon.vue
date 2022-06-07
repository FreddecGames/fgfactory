<template>
    <div class="col scrollbar">
        <div class="row g-3">
            <HeaderItem :item="item" />
            <CardProduction :item="item" />
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'item' ],    
}
</script>