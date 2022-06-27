<template>
    <div class="col-auto nav-item">
        <button type="button" class="w-100 btn nav-link pt-2 pb-1 justify-content-center" :class="{ 'active':$parent.currentTabId == tabId }" @click="$parent.setCurrentTabId(tabId)">
            <div class="row g-0 align-items-center">
                <div class="col-12">
                    <span class="h4"><i :class="'fas fa-fw ' + icon"></i></span>
                </div>
                <div class="col-12">
                    <span class="small text-uppercase">{{ $t('tab_' + tabId) }}</span>
                </div>
            </div>
        </button>
    </div>
</template>

<script>
export default {

    props: [ 'tabId', 'icon' ],
}
</script>