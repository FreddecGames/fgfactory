<template>
    <div class="col-auto" style="width:100px;">
        <button type="button" class="w-100 btn btn-primary justify-content-center" :class="{ 'border-primary':border == true }" @click="click()">
            <div class="row gx-2 align-items-center">
                <div class="col-auto">
                    <span class="h5"><i :class="'fas fa-fw ' + icon"></i></span>
                </div>
                <div class="col-auto">
                    <span>{{ label }}</span>
                </div>
            </div>
        </button>
    </div>
</template>

<script>
export default {

    props: [ 'label', 'icon', 'click', 'border' ],
}
</script>