<template>
  <div>
    <FacilitiesList v-show="key===0" :fun="look"></FacilitiesList>
    <ReportRecords v-if="key===1" :data="row" :fun="back" @changeshow="handle($event)"></ReportRecords>
  </div>
</template>

<script>
import FacilitiesList from './facilities-list'
import ReportRecords from './report-records'
export default {
  // name: "build",
  data() {
    return {
     key:0,
     row:{}
    }
  },
  components:{
    FacilitiesList,
    ReportRecords
  },
  methods: {
   look(val,key){
      this.key = key
      this.row = val
    },
     back(val){
      this.key = 0
    },
    handle(bool){
      this.key=bool
      console.log(this.key)
    }
  },
  mounted(){
  }
};
</script>

<style lang="scss" scoped>

</style>