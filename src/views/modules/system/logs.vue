<template>
  <div style="padding:30px;">
    <!-- 搜索区 -->
    <el-form :inline="true" size="small" class="queryForm" :model="queryForm">
      <el-form-item>
        <el-radio-group v-model="queryForm.type" @change="getLogs">
          <el-radio-button
            v-for="item in typeList"
            :key="item.value"
            :label="item.value"
          >{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户">
        <el-select v-model="queryForm.operateUserId" placeholder="请选择" clearable>
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组织">
        <el-select v-model="queryForm.organizationId" placeholder="请选择" clearable>
          <el-option
            v-for="item in organization"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-button @click="getLogs">搜索</el-button>
    </el-form>

    <!-- 表格区 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="operateTime" label="日期" width="180"></el-table-column>
      <el-table-column prop="operateUsername" label="姓名" width="180"></el-table-column>
      <el-table-column prop="operateIp" label="地址"></el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10,20,50]"
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
      typeList: [
        { label: "今天", value: "1" },
        { label: "昨天", value: "3" },
        { label: "本周", value: "4" },
        { label: "上周", value: "5" },
        { label: "本月", value: "6" },
        { label: "上月", value: "7" }
      ],
      type: 2,
      time: "",
      currentPage: 1,
      tableData: [],
      options: [],
      value: "",
      dialogVisible: false,
      title: "",
      total: 0,
      pageSize: 10,
      organization:null,
      userList:null,
      queryForm:{
         beginTime:'',
          endTime:'',
          model:'',
          operateUserId:'',
          organizationId:'',
          type:'1',
      }
    };
  },
  created() {
    this.getLogs()
    this.getOrganization()
    this.getUserList()
  },
  methods: {
    async getLogs() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl(`/sysLog/list?pageNo=${this.currentPage}&pageSize=${this.pageSize}`),
        method: "post",
        data: this.$http.adornData({
          ...this.queryForm
        })
      });
      if (res && res.code === 0) {
        this.tableData = res.data.records;
        this.total = res.data.total;
      }
    },
     async getOrganization(){
      const {data:res}=await this.$http({
              url: this.$http.adornUrl('/sysOrganization/list'),
              method: 'post',
              data: this.$http.adornData({})
            })
      if(res&&res.code===0){
        this.organization=res.data.records
      }
    },
    async getUserList(){
      const {data:res}=await this.$http({
              url: this.$http.adornUrl('/sysUser/list'),
              method: 'post',
              data: this.$http.adornData({})
            })
      if(res&&res.code===0){
        this.userList=res.data.records
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getLogs();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getLogs();
    },
    add() {
      this.dialogVisible = true;
      this.title = "新增算法";
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  margin-top: 20px;
  margin-left: 50%;
}
</style>