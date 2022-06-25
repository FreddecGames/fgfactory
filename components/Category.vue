<template>
    <div class="col-12">
        <button class="btn px-0 pt-0 pb-1" :class="{ 'collapsed':!show }" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse_' + id" aria-expanded="false" :aria-controls="'collapse_' + id" @click="$emit('click')">
            <div class="subtitle mb-0"><i class="fas fa-fw fa-caret-down"></i> {{ $t('category_' + id) }}</div>
        </button>
        <div class="collapse" :class="{ 'show':show }" :id="'collapse_' + id">
            <div class="row g-2">
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'id', 'show' ],    
}
</script>