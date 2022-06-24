<template>
    <span>{{ time }}</span>
</template>

<script>
export default {

    props: [ 'value' ],
    
    computed: {
        
        time: function() {
        
            let val = this.value
            
            if (val == Infinity) return 'Infinity'
            
            if (val < 1) return Math.ceil(val * 1000) + ' ms'
            
            let d = Math.floor(val / (3600 * 24))
            
            let h = Math.floor(val / 3600) % 24
            if (h < 10) { h = '0' + h }
            
            let m = Math.floor(val / 60) % 60
            if (m < 10) { m = '0' + m }
            
            let s = Math.floor(val % 60)
            if (s < 10) { s = '0' + s }
            
            if (d > 0) val = d + this.$t('abbr_day') + ' ' + h + ':' + m + ':' + s
            else val = h + ':' + m + ':' + s
            
            return val
        },
        
        years: function() { return Math.floor((this.value * 4) / 365) },
        
        days: function() { return Math.floor(this.value * 4 - (this.years * 365)) },
    },
}
</script>