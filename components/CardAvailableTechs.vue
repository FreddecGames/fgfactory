<template>
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <div class="row gx-2">
                    <div class="col">
                        <span>Available Researches</span>
                    </div>
                </div>                
            </div>
            <div class="list-group list-group-flush">
                <div v-if="techs.length <= 0" class="list-group-item text-center">
                    <span>No more research available - check the Tutorial"</span>
                </div>
                <RowTech v-for="tech in techs" :key="tech.id" :tech="tech" />
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: [ 'lab' ],
    
    computed: {
    
        techs() {
        
            let ret = []
            this.lab.techs.forEach(tech => {
                if (tech.count < 1) {
                    ret.push(tech)
                }
            })

            return ret
        },
    },
}
</script>