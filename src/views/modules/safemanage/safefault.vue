<template>
  <div>
    <SafeFaultList v-show="key===0" :fun="look"></SafeFaultList>
    <SafeFaultDetail v-if="key===1" :data="row" :fun="back"></SafeFaultDetail>
  </div>
</template>

<script>
import SafeFaultList from './safeFault-list'
import SafeFaultDetail from './safeFault-detail'
export default {
  data() {
    return {
     key:0,
     row:{}
    }
  },
  components:{
    SafeFaultList,
    SafeFaultDetail
  },
  methods: {
   look(val,key){
      this.key = key
      this.row = val
    },
     back(val){
      this.key = 0
    },
  },
  mounted(){
  }
};
</script>

<style lang="scss" scoped>

</style>