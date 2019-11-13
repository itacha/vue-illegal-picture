<template>
  <div style="padding:30px;">
    <!-- 搜索区 -->
    <el-form label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="查询时间：">
            <el-date-picker
      v-model="time"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
          </el-form-item>
        </el-col>
         <el-col :span="4">
          <el-form-item label="设备来源：">
            <el-select v-model="source" placeholder="请选择">
              <el-option
                v-for="item in sourceArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>        
        <el-col :span="6" :push="4">
          <el-button type="primary" @click="search">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格区 -->
    <el-table :data="tableData" style="width: 100%;margin-top:20px;">
        <el-table-column prop="date" label="设备来源" width="180"></el-table-column>
        <el-table-column prop="name" label="点位数（个）" width="180"></el-table-column>
        <el-table-column  label="合格图片（组）">
        </el-table-column>
        <el-table-column prop="address" label="结算单价（元）">
           <template slot-scope="scope">
            <el-input v-if="scope.row.inputVisible" style="width:100px;" v-model="scope.row.name"></el-input>
            <span v-else style="display:inline-block;width:100px">{{scope.row.name}}</span>
            <el-link type="primary" :underline="false" @click="cancel(scope.row)" v-if="scope.row.inputVisible">取消</el-link>
            <el-link type="primary" :underline="false" @click="save(scope.row)" v-if="scope.row.inputVisible">保存</el-link>
            <el-link type="primary" :underline="false" @click="edit(scope.row)" v-else>编辑</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="营收预估（元）"></el-table-column>
      </el-table>

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
  data() {
    return {
      time:null,
       source: '',
      sourceArr: [
        {
          value: 1,
          label: '智能交通'
        },
        {
          value: 2,
          label: '电子警察'
        }
      ],
      currentPage: 1,
       tableData: [
        {
          id:1,
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          inputVisible:false
        },
        {
          id:2,
          date: "2016-05-02",
          name: "王小",
          address: "上海市普陀区金沙江路 1518 弄",
          inputVisible:false
        }
      ],
      pageSize:10,
      total:0
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
     handleSizeChange(val) {
      this.pageSize=val
    },
    handleCurrentChange(val) {
      this.currentPage=val
    },
    edit(row){
      row.inputVisible=true
    },
    cancel(row){
      row.inputVisible=false
    },
    async save(row){
      row.inputVisible=false
      const { data: res } = await this.$http({
        url: this.$http.adornUrl(``),
        method: 'post',
        data: this.$http.adornData({})
      })
      if (res && res.code !== 0) return this.$message.error('编辑失败！')
      this.$message.success('编辑成功！')
      this.search()
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  margin-top: 30px;
  margin-left: 50%;
}
</style>