<template>
  <div style="margin:20px;">
    <!-- 搜索区 -->
    <el-form ref="buildForm" :model="buildForm" label-width="100px">
      <el-row :gutter="20">
           <el-col :span="4">
          <el-form-item label="状态：">
            <el-select v-model="status" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="设施代码：">
            <el-select v-model="status" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="4">
          <el-form-item label="设施地址：">
            <el-select v-model="status" placeholder="请选择">
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
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格区 -->
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="设施代码" width="180"></el-table-column>
        <el-table-column prop="name" label="设施名称" width="180"></el-table-column>
        <el-table-column prop="address" label="设施地址"></el-table-column>
        <el-table-column  label="设施状态"></el-table-column>
        <el-table-column  label="最近操作时间"></el-table-column>
        <el-table-column label="操作"  width="150">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="showDetail(scope.row)">详情</el-link>
          </template>
        </el-table-column>
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
    props: ["fun", "data"],
  data() {
    return {
      currentPage: 1,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      total:0,
      pageSize:10
    }
  },
  created() {
    // this.search()
  },
  methods:{
    showDetail(val){
      this.fun(val,1)
    },
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
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  margin-top: 20px;
  margin-left: 50%;
}
</style>