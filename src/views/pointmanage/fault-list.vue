<template>
  <div style="padding:20px">
    <!-- 搜索区 -->
    <el-form label-width="100px">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="状态：">
            <el-select v-model="status" placeholder="请选择">
              <el-option
                v-for="item in statusArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
        <el-col :span="6">
          <el-form-item label="建设时间：">
            <el-date-picker
              v-model="buildTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6" :push="4">
          <el-button type="primary" @click="getPoint">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格区 -->
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="设备编号" width="180"></el-table-column>
        <el-table-column prop="name" label="设备名称" width="180"></el-table-column>
        <el-table-column prop="address" label="设备类型"></el-table-column>
        <el-table-column  label="设备来源"></el-table-column>
        <el-table-column  label="安装地址"></el-table-column>
        <el-table-column  label="保管单位"></el-table-column>
        <el-table-column  label="运行状态"></el-table-column>
        <el-table-column  label="建设时间"></el-table-column>
        <el-table-column  label="启用时间"></el-table-column>
        <el-table-column  label="停用时间"></el-table-column>
        <el-table-column  label="安全设施"></el-table-column>
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
        :total="total"
        background
      ></el-pagination>
  </div>
</template>

<script>
export default {
    props: ["fun", "data"],
  data() {
    return {
      status: 2,
      statusArr: [
        {
          value: 1,
          label: '正常'
        },
        {
          value: 2,
          label: '故障'
        }
      ],
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
      buildTime:null,
      currentPage: 1,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      total:0,
      pageSize:10
    }
  },
  created(){
    // this.getPoint()
  },
  methods:{
    showDetail(val){
      this.fun(val, 1)
    },
    async getPoint() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl(
          `?pageSize=${this.pageSize}&pageNo=${this.currentPage}`
        ),
        method: 'post',
        data: this.$http.adornData({
          status: this.status,
          source: this.source,
          buildTime: this.buildTime
        })
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