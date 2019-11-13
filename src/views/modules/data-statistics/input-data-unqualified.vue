<template>
  <div style="padding:30px">
    <!-- 搜索区 -->
    <el-form :inline="true" size="small" class="queryForm" :model="queryForm">
      <el-form-item>
        <el-radio-group v-model="queryForm.timeType" @change="getDataManualEntry">
          <el-radio-button
            v-for="item in typeList"
            :key="item.value"
            :label="item.value"
          >{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-button @click="getDataManualEntry()">刷新</el-button>
    </el-form>

    <!-- 表格区 -->
    <el-table :data="tableData" style="width: 100%;margin-top:30px;" show-summary>
      <el-table-column type="selection" label="全选" width="100"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="beginTime" label="开始时间" width="180"></el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
      <el-table-column label="耗时（小时）" >
        <template slot-scope="scope">
          {{parseInt((new Date(scope.row.endTime).getTime()-new Date(scope.row.beginTime).getTime())/1000/3600)}}
        </template>
      </el-table-column>
      <el-table-column prop="source" label="来源"></el-table-column>
      <el-table-column prop="unQualifyNum" label="不合格总数"></el-table-column>
      <el-table-column prop="carLicenseErrorNum" label="车牌错误数（组）"></el-table-column>
      <el-table-column prop="notIllegalNum" label="不属于违法行为数（组）" width="200"></el-table-column>
      <el-table-column prop="watermarkErrorNum" label="水印错误（组）"></el-table-column>
      <el-table-column prop="otherNum" label="其他（组）"></el-table-column>
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
  data() {
    return {
      typeList: [
        { label: "今日", value: "2" },
        { label: "本周", value: "3" },
        { label: "本月", value: "4" },
        { label: "本季", value: "5" },
        { label: "本年", value: "7" }
      ],
      type: 2,
      time: "",
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      total: 0,
      queryForm: {
        beginTime: "",
        endTime: "",
        timeType: ""
      }
    };
  },
  created() {
    this.getDataManualEntry();
  },
  methods: {
    async getDataManualEntry() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl(
          `/dataManualEntry/list?pageNo=${this.currentPage}&pageSize=${this.pageSize}`
        ),
        method: "post",
        data: this.$http.adornData({ ...this.queryForm })
      });
      if (res.code !== 0) return this.$message.error("获取数据失败！");
      this.tableData = res.data.records;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDataManualEntry();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDataManualEntry();
    }
  }
};
</script>
<style>
.el-card {
  margin: 20px;
}
</style>
<style lang="scss" scoped>
.page {
  margin-top: 60px;
  margin-left: 50%;
}
</style>