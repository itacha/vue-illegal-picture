<template>
  <div style="margin:20px;padding:20px">
      <div>
           <el-button type="primary" icon="el-icon-back" circle @click="back()" style="display:inline-block;margin:20px"></el-button>
    <span>上报记录</span>
      </div>
   
    <el-form ref="buildForm" :model="searchForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="查询时间：">
            <el-date-picker
                v-model="searchForm.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="上报问题：">
            <el-select v-model="searchForm.question" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :push="4">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="printContent">打印</el-button>
        </el-col>
      </el-row>
    </el-form>

    <div id="subOutputRank-print">
    <el-table :data="tableData" style="width: 100%"  @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column
      type="selection"
      width="55">
    </el-table-column>
      <el-table-column prop="name" label="设施代码" width="180"></el-table-column>
      <el-table-column prop="name" label="设施名称" width="180"></el-table-column>
      <el-table-column prop="address" label="设施地址"></el-table-column>
      <el-table-column label="设施状态" prop="name"></el-table-column>
      <el-table-column prop="address" label="上报问题"></el-table-column>
      <el-table-column prop="address" label="上报时间"></el-table-column>
      <el-table-column prop="address" label="打印状态"></el-table-column>
      <el-table-column prop="address" label="备注"></el-table-column>
    </el-table>
    </div>

      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      class="page"
      background
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: ["fun", "data"],
  data() {
    return {
      currentPage: 1,
      searchForm:{
          time:'',
          question:''
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          inputVisible: false
        },
        {
          date: "2016-05-02",
          name: "王小",
          address: "上海市普陀区金沙江路 1518 弄",
          inputVisible: false
        }
      ],
      options:[],
      total:0,
      pageSize:10,
      multipleSelection:[]
    }
  },
   created() {
    // this.search()
  },
  methods:{
     async search() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl(
          `?pageSize=${this.pageSize}&pageNo=${this.currentPage}`
        ),
        method: 'post',
        data: this.$http.adornData({})
      })
      if (res && res.code === 0) {
        this.tableData = res.data.records
      }
    },
    printContent(e){
                let subOutputRankPrint = document.getElementById('subOutputRank-print');
                // console.log(subOutputRankPrint.innerHTML);
                let newContent =subOutputRankPrint.innerHTML;
                let oldContent = document.body.innerHTML;
                document.body.innerHTML = newContent;
                document.getElementsByTagName('body')[0].style.zoom=0.5;
                // this.$emit("changeshow", 0)
                window.print();               
                // window.location.reload();
                this.$router.go(0)
                document.body.innerHTML = oldContent;               
                // this.$emit("changeshow", 1)
                return false;
     },
     handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection)
        // condole.log(val)
      },
      handleSizeChange(val) {
      this.pageSize=val
    },
    handleCurrentChange(val) {
      this.currentPage=val
    },
     back(){
      this.fun()
    }
  },
  mounted(){
  }
}
</script>

<style lang="scss" scoped>
.page{
    margin-top:30px;
}
</style>