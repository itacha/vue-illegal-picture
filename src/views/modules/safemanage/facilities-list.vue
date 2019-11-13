<template>
  <div style="margin:20px;padding:20px">
    <!-- 搜索区 -->
    <el-form ref="searchForm" :model="searchForm" label-width="100px">
      <el-row :gutter="20">
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
          <el-form-item label="设施名称：">
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
        <el-col :span="4">
          <el-form-item label="设施状态：">
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
      <el-table-column prop="date" label="设施代码" width="180">
        <template slot-scope="scope">
          <el-input v-if="scope.row.inputVisible" v-model="scope.row.date"></el-input>
          <span v-else>{{scope.row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="设施名称" width="180">
        <template slot-scope="scope">
          <el-input v-if="scope.row.inputVisible" v-model="scope.row.date"></el-input>
          <span v-else>{{scope.row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="设施地址">
        <template slot-scope="scope">
          <el-input v-if="scope.row.inputVisible" v-model="scope.row.date"></el-input>
          <span v-else>{{scope.row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column label="设施状态" prop="name">
        <template slot-scope="scope">
          <el-input v-if="scope.row.inputVisible" v-model="scope.row.date"></el-input>
          <span v-else>{{scope.row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="showReport(scope.row)">上报</el-link>
          <el-link
            type="primary"
            :underline="false"
            @click="cancel(scope.row)"
            v-if="scope.row.inputVisible"
          >取消</el-link>
          <el-link
            type="primary"
            :underline="false"
            @click="saveEdit(scope.row)"
            v-if="scope.row.inputVisible"
          >保存</el-link>
          <el-link type="primary" :underline="false" @click="edit(scope.row)" v-else>编辑</el-link>
          <el-link type="danger" :underline="false" @click="remove(scope.row)">删除</el-link>
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

    <el-dialog title="上报" :visible.sync="dialogVisible" width="50%">
      <el-row :span="20">
        <el-col :span="6">设施代码：{{reportData.name}}</el-col>
        <el-col :span="6">设施名称：{{reportData.name}}</el-col>
        <el-col :span="6">设施地址：{{reportData.name}}</el-col>
        <el-col :span="6">设施状态：{{reportData.name}}</el-col>
      </el-row>
      <el-form style="margin-top:10px; border-top:1px solid #ccc;padding-top:10px;">
        <el-form-item label="问题类型：">
          <el-select placeholder="请选择">
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" :rows="2" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="report">上报</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['fun', 'data'],
  data() {
    return {
      currentPage: 1,
      dialogVisible: false,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          inputVisible: false
        },
        {
          date: '2016-05-02',
          name: '王小',
          address: '上海市普陀区金沙江路 1518 弄',
          inputVisible: false
        }
      ],
      reportData: {},
      type: [],
      total: 0,
      pageSize: 10,
      searchForm: {}
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
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    showReport(row) {
      this.dialogVisible = true
      this.reportData = row
    },
    async report(val) {
      this.dialogVisible = false
      try {
      //    const { data: res } = await this.$http({
      //   url: this.$http.adornUrl(``),
      //   method: 'post',
      //   data: this.$http.adornData({})
      // })
      // if (res && res.code !== 0) return this.$message.error('上报失败！')
      // this.$message.success('上报成功！')
      this.fun(val, 1)
      } catch (error) {
        this.$message.error(error)
      }
    },
    edit(row) {
      row.inputVisible = true
    },
    cancel(row) {
      row.inputVisible = false
    },
    async saveEdit(row) {
      row.inputVisible = false
      const { data: res } = await this.$http({
        url: this.$http.adornUrl(``),
        method: 'post',
        data: this.$http.adornData({})
      })
      if (res && res.code !== 0) return this.$message.error('编辑失败！')
      this.$message.success('编辑成功！')
      this.search()
    },
    remove() {
      this.$confirm(
        '该安全设施可能与某点位信息相关联，您确实要进行当前操作吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          const { data: res } = await this.$http({
            url: this.$http.adornUrl(``),
            method: 'post',
            data: this.$http.adornData({})
          })
          if (res && res.code !== 0) return this.$message.error('删除失败！')
          this.$message.success('删除成功！')
          this.search()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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