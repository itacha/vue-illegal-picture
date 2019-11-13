<template>
  <div>
    <FaultList v-show="key===0" :fun="look"></FaultList>
    <FaultDetail v-if="key===1" :data="row" :fun="back"></FaultDetail>
  </div>
</template>

<script>
import FaultList from './fault-list'
import FaultDetail from './fault-detail'
export default {
  name: "build",
  data() {
    return {
     key:0,
     row:{}
    }
  },
  components:{
    FaultList,
    FaultDetail
  },
  methods: {
   look(val,key){
      this.key = key
      this.row = val
    },
     back(val){
      this.key = 0
    },
  }
};
</script>

<style lang="scss" scoped>

</style>