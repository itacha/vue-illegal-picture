<template>
  <div style="padding:30px">
    <!-- 搜索区 -->
    <el-form :inline="true" size="small" class="queryForm">
      <el-form-item>
        <el-radio-group v-model="type" @change="search">
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
      <el-button @click="search">刷新</el-button>
    </el-form>

    <!-- 表格区 -->
    <el-table :data="tableData" style="width: 100%;margin-top:30px;" show-summary>
      <el-table-column type="selection" label="全选" width="100"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="date" label="开始时间" width="180"></el-table-column>
      <el-table-column prop="name" label="结束时间" width="180"></el-table-column>
      <el-table-column prop="address" label="耗时（小时）"></el-table-column>
      <el-table-column prop="address" label="来源"></el-table-column>
      <el-table-column prop="address" label="图片总数（组）"></el-table-column>
      <el-table-column prop="address" label="合格数（组）"></el-table-column>
      <el-table-column prop="address" label="不合格数（组）"></el-table-column>
      <el-table-column prop="address" label="疑似合格（组）"></el-table-column>
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
       tableData: [
        {
          id:1,
          date: "2016-05-02",
          name: "王小虎",
          address: "1",
          inputVisible:false
        },
        {
          id:2,
          date: "2016-05-02",
          name: "王小",
          address: "1",
          inputVisible:false
        }
      ],
      options: [],
      value: "",
      dialogVisible: false,
      title: "",
      total:0,
      pageSize:10
    }
  },
  created() {
    // this.search()
  },
  methods: {
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
  }
};
</script>

<style lang="scss" scoped>
.page {
  margin-top: 60px;
  margin-left: 50%;
}
</style>