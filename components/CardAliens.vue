<template>
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <div class="row gx-2">
                    <div class="col">
                        <span>Aliens</span>
                    </div>
                </div>
            </div>
            <div v-if="item.game.getAlienCount() < 1" class="card-body">
                <div class="text-center">
                    <span class="text-muted">Generate a new Alien wave to collect Alien Eggs</span>
                </div>
                <div class="mt-2 d-flex justify-content-center">
                    <button type="button" class="btn btn-primary" @click="generate()">
                        <span>Generate</span>
                    </button>
                </div>
            </div>
            <div v-if="item.game.getAlienCount() > 0" class="card-body">
                <div class="row g-2 alien-items-center justify-content-center">
                    <BlockAlien v-for="alien in item.game.aliens" :key="alien.id" :alien="alien" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'item', ],
    
    methods: {
    
        generate() {
        
            this.item.game.generateAliens()
        },
    },
}
</script>