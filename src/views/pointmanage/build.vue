<template>
  <div>
    <PointList v-show="key===0" :fun="look"></PointList>
    <PointDetail v-if="key===1" :data="row" :fun="back"></PointDetail>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
// import cityData from './cityData.js'
import PointList from './point-list'
import PointDetail from './point-detail'
export default {
  name: "build",
  data() {
    return {
     key:0,
     row:{}
    }
  },
  components:{
    PointList,
    PointDetail
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