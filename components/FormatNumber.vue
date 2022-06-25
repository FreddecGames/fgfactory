<template>
    <span class="text-nowrap">{{ format.value }}<small v-if="format.symbol" class="opacity-75"> {{ format.symbol }}</small></span>
</template>

<script>
export default {
    props: [ 'value' ],
    computed: {
    
        format: function() {
            
            let sign = ""
            if (this.value < 0) sign = "-"
            
            let absValue = Math.abs(this.value)
            
            let ret = "", symbol = null
            
                 if (absValue >= 1e36) { ret = sign + Math.floor(100 * absValue / 1e36) / 100; symbol = "Ud"; }
            else if (absValue >= 1e33) { ret = sign + Math.floor(100 * absValue / 1e33) / 100; symbol = "Dc"; }
            else if (absValue >= 1e30) { ret = sign + Math.floor(100 * absValue / 1e30) / 100; symbol = "No"; }
            else if (absValue >= 1e27) { ret = sign + Math.floor(100 * absValue / 1e27) / 100; symbol = "Oc"; }
            else if (absValue >= 1e24) { ret = sign + Math.floor(100 * absValue / 1e24) / 100; symbol = "Sp"; }
            else if (absValue >= 1e21) { ret = sign + Math.floor(100 * absValue / 1e21) / 100; symbol = "Sx"; }
            else if (absValue >= 1e18) { ret = sign + Math.floor(100 * absValue / 1e18) / 100; symbol = "Qi"; }
            else if (absValue >= 1e15) { ret = sign + Math.floor(100 * absValue / 1e15) / 100; symbol = "Qa"; }
            else if (absValue >= 1e12) { ret = sign + Math.floor(100 * absValue / 1e12) / 100; symbol = "T";  }
            else if (absValue >= 1e9)  { ret = sign + Math.floor(100 * absValue / 1e9) / 100;  symbol = "B";  }
            else if (absValue >= 1e6)  { ret = sign + Math.floor(100 * absValue / 1e6) / 100;  symbol = "M";  }
            else if (absValue >= 1e3)  { ret = sign + Math.floor(100 * absValue / 1e3) / 100;  symbol = "K";  }
            
            else ret = sign + Math.floor(100 * absValue) / 100
            
            return { value:ret, symbol:symbol }
        }
    },
}
</script>