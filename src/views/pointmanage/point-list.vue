<template>
  <div class="app-container">
    <div style="padding:30px;">
      <el-form ref="buildForm" :model="buildForm" label-width="100px">
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
            <el-button type="primary" @click="add">新增点位</el-button>
            <el-button type="primary">批量导入</el-button>
            <i class="el-icon-question" style="font-size:20px;margin-left:10px;"></i>
          </el-col>
        </el-row>
      </el-form>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="设备编号" width="180"></el-table-column>
        <el-table-column prop="name" label="设备名称" width="180"></el-table-column>
        <el-table-column prop="address" label="设备类型"></el-table-column>
        <el-table-column label="设备来源"></el-table-column>
        <el-table-column label="安装地址"></el-table-column>
        <el-table-column label="保管单位"></el-table-column>
        <el-table-column label="运行状态"></el-table-column>
        <el-table-column label="建设时间"></el-table-column>
        <el-table-column label="启用时间"></el-table-column>
        <el-table-column label="停用时间"></el-table-column>
        <el-table-column label="安全设施"></el-table-column>
        <el-table-column label="操作" header-align="center" width="150">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="showDetail(scope.row)">详情</el-link>
            <el-link type="primary" :underline="false" @click="edit(scope.row)">编辑</el-link>
            <el-link type="primary" :underline="false" @click="remove(scope.row)">删除</el-link>
            <el-link type="primary" :underline="false" @click="statusChange(scope.row,$event)">启用</el-link>
            <el-link type="primary" :underline="false" @click="statusChange(scope.row,$event)">禁用</el-link>
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
    <!-- add point -->
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <span slot="title">{{title}}</span>
      <el-form :model="pointForm" label-width="110px" :rules="rules" ref="pointForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="点位编号：">
              <el-input v-model="pointForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="点位名称：" prop="pointName">
              <el-input v-model="pointForm.pointName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="点位类型：">
              <el-select v-model="pointForm.name" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-link type="danger" :underline="false" @click="input1show=false">删除</el-link>
              <el-link type="success" :underline="false" @click="input1show = true">新增</el-link>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="点位来源：">
              <el-select v-model="pointForm.source" placeholder="请选择">
                <el-option
                  v-for="item in sourceArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item v-if="input1show">
              <el-input style="margin-left:0"></el-input>
              <el-link type="danger" :underline="false" @click="input1show=false">删除</el-link>
              <el-link type="success" :underline="false">确认</el-link>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装区域：">
              <el-cascader v-model="pointForm.name" :options="options"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="保管单位：">
              <el-select v-model="pointForm.name" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-link type="danger" :underline="false" @click="input2show=false">删除</el-link>
              <el-link type="success" :underline="false" @click="input2show=true">新增</el-link>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装地址：" prop="installAddress">
              <el-input v-model="pointForm.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item v-if="input2show">
              <el-input v-model="pointForm.name"></el-input>
              <el-link type="danger" :underline="false" @click="input2show=false">删除</el-link>
              <el-link type="success" :underline="false">确认</el-link>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建设时间：">
              <el-date-picker
                v-model="pointForm.buildTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分配算法：">
              <el-select v-model="pointForm.suanFa" placeholder="请选择">
                <el-option
                  v-for="item in suanFaList"
                  :key="item.id"
                  :label="item.algorithmNameName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配违法代码：">
              <el-select v-model="pointForm.name" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
// import cityData from './cityData.js'
import { validPointName, validAddress } from '@/utils/validate'

export default {
  name: 'point-list',
  props: ['fun', 'data'],
  data() {
    const validatePointName = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('点位名称不能为空'))
      } else if (!validPointName(value)) {
        callback(new Error('点位名称不支持特殊字符的输入,限制长度为32个字符'))
      } else {
        callback()
      }
    }
    const validateAddress = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('安装地址不能为空'))
      } else if (!validAddress(value)) {
        callback(new Error('仅支持中文/数字/字母的输入，限制长度为50个字符'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        pointName: [
          { required: true, trigger: 'blur', validator: validatePointName }
        ],
        installAddress: [
          { required: true, trigger: 'blur', validator: validateAddress }
        ]
      },
      buildTime: null,
      value: '',
      dialogVisible: false,
      currentPage: 1,
      buildForm: {},
      status: '',
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
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      tableData: [
        {
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          // 1启用
          status: 0
        },
        {
          id: 2,
          date: '2016-05-02',
          name: '王小',
          address: '上海市普陀区金沙江路 1518 弄',
          // 1启用
          status: 1
        }
      ],
      pointForm: {
        pointName: '',
        installAddress: ''
      },
      input1show: false,
      input2show: false,
      title: '',
      total: 0,
      pageSize: 10,
      // cityData,
      suanFaList: []
    }
  },
  mounted() {
    this.getSuanFa()
    // this.getPoint()
  },
  methods: {
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
    async getSuanFa() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl('/algorithmInfo/list'),
        method: 'post',
        data: this.$http.adornData({
          algorithmName: '',
          algorithmType: '',
          runStatus: ''
        })
      })
      if (res && res.code === 0) {
        this.suanFaList = res.data.records
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    add() {
      this.title = '新增点位'
      this.editData = {}
      this.dialogVisible = true
    },
    edit(row) {
      this.title = '编辑点位'
      this.editData = row
      this.dialogVisible = true
    },
    addOrEdit() {
      let api = this.title == '新增点位' ? '' : ''
      let message =
        this.title == '新增点位' ? '新增点位成功！' : '修改点位成功！'
      let err = this.title == '新增点位' ? '新增点位失败！' : '修改点位失败！'
      this.$refs['pointForm'].validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http({
            url: this.$http.adornUrl(api),
            method: 'post',
            data: this.$http.adornData()
          })
          if (res.code !== 0) return this.$message.error(err)
          this.$message.success(message)
          this.dialogVisible = false
          this.getPoint()
        } else {
          return false
        }
      })
    },
    //查看
    showDetail(val) {
      this.fun(val, 1)
    },
    remove() {
      this.$confirm(
        '该信息可能与其他数据相关联，直接删除会导致相关联的功能不可用。您确认要进行当前操作吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async statusChange(row, event) {
      let api = event.target.innerText == '启用' ? '' : ''
      let message =
        event.target.innerText == '启用' ? '启用成功！' : '禁用成功！'
      let err = event.target.innerText == '启用' ? '启用失败！' : '禁用失败！'
      const { data: res } = await this.$http({
        url: this.$http.adornUrl(api),
        method: 'post',
        data: this.$http.adornData()
      })
      if (res.code !== 0) return this.$message.error(err)
      this.$message.success(message)
      this.getPoint()
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