<template>
  <div style="padding:30px">
    <!-- 搜索区 -->
    <el-form :inline="true" size="small" class="queryForm" >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="算法类型：">
            <!-- <el-tag>一般违法</el-tag>
            <el-tag type="success">车牌违法</el-tag>
            <el-tag type="info">交通安全设施识别</el-tag>
            <el-tag type="warning">设备故障算法</el-tag> -->
            <el-radio-group v-model="type" @change="getSuanFa">
            <el-radio-button
              v-for="item in suanfaType"
              :key="item.name"
              :label="item.label"
            >{{item.label}}</el-radio-button>
          </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态：">
            <el-select v-model="runStatus" placeholder="请选择" @change="getSuanFa" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button @click="add">新增</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 表格区 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="algorithmNameName" label="算法名称" width="180"></el-table-column>
      <el-table-column prop="algorithmTypeName" label="算法类型" width="180"></el-table-column>
      <el-table-column label="服务主机">
        <tempalte slot-scope="scope">
          <span>{{scope.row.ip}}:{{scope.row.port}}</span>
        </tempalte>
      </el-table-column>
      <el-table-column prop="runStatusValue" label="运行状态"></el-table-column>
      <el-table-column prop="algorithmErrorTypeName" label="错误类型"></el-table-column>
      <el-table-column prop="lastRunTime" label="最后运行时间"></el-table-column>
      <el-table-column prop="stopLength" label="停止时间（小时）"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
            <el-link type="success" :underline="false" @click="statusChange(scope.row,$event)" v-if="scope.row.runStatus==1">启用</el-link>
            <el-link type="danger" :underline="false" @click="statusChange(scope.row,$event)" v-else>停用</el-link>
          <el-link type="primary" :underline="false" @click="edit(scope.row)">编辑</el-link>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title :visible.sync="dialogVisible" width="50%">
      <span slot="title">{{title}}</span>
      <el-form :model="addOrEditData" ref="addOrEditData" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="ip：" prop="ip">
              <el-input style="width:150px;" v-model="addOrEditData.ip"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="端口号：" prop="port">
              <el-input style="width:150px;" v-model="addOrEditData.port"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="算法类型：" prop="algorithmTypeName">
              <el-select v-model="addOrEditData.algorithmTypeName" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="算法名称：" prop="algorithmNameName">
              <el-select v-model="addOrEditData.algorithmNameName" placeholder="请选择">
                <el-option
                  v-for="item in nameList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="启用时间：">
              <el-radio label="3" v-model="addOrEditData.enableType">永久</el-radio>
              <el-radio label="2" v-model="addOrEditData.enableType">立即</el-radio>
              <el-date-picker
                v-model="addOrEditData.time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-if="addOrEditData.enableType!=='3'"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOrEdit()">保存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {handleDate} from '@/utils/index'
export default {
  // name:'algorithm-total',
  data() {
    return {
      tableData: [],
      options: [
        {
          label:'在线',
          value:0
        },
         {
          label:'离线',
          value:1
        }
      ],
      value: "",
      dialogVisible: false,
      title: "",
      nameList:[],
      typeList:[],
       suanfaType: [
        { label: "一般违法", value: "1" },
        { label: "车牌违法", value: "2" },
        { label: "交通安全设施识别", value: "3" },
        { label: "设备故障算法", value: "4" }
      ],
      type:'',
      addOrEditData:{},
      runStatus:'',
       rules:{
        algorithmNameName:[{ required: true, message: '算法名称不能为空', trigger: 'change' }],
        ip:[{ required: true, message: 'ip不能为空', trigger: 'blur' }],
        // port:[{ required: true, message: '端口号不能为空', trigger: 'blur' }],
        algorithmTypeName:[{ required: true, message: '算法类型不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getSuanFa()
    this.getName()
    this.getType()
  },
  methods: {
    async getSuanFa() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl("/algorithmInfo/list"),
        method: "post",
        data: this.$http.adornData({
          algorithmName:'',
          algorithmType:this.type,
          runStatus:this.runStatus
        })
      });
      if (res && res.code === 0) {
        this.tableData = res.data.records;
      }
    },
    async getName() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl("/algorithmInfo/nameList"),
        method: "post",
        data: this.$http.adornData({
          pageSize:1000,
          pageNo:1
        })
      });
      if (res && res.code === 0) {
        this.nameList = res.data;
      }
    },
    async getType() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl("/algorithmInfo/typeList"),
        method: "post",
        data: this.$http.adornData({
          pageSize:1000,
          pageNo:1
        })
      });
      if (res && res.code === 0) {
        this.typeList = res.data;
      }
    },
    statusChange(row,event){
      if (event.target.innerText=='启用') {
        this.$confirm('配置了该算法信息的所有点位均将重启该算法实现的功能，是否立即开启?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {data:res}=await this.$http({
              url: this.$http.adornUrl(`/algorithmInfo/enable?id=${row.id}`),
              method: 'post',
              data: this.$http.adornData({})
            })
            if(res.code!==0)return this.$message.error('启用失败！')
            this.getSuanFa()
          this.$message({
            type: 'success',
            message: '启用成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        })
      }else{
         this.$confirm('配置了该算法信息的所有点位均将失去该算法实现的功能，是否立即停用?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
           const {data:res}=await this.$http({
              url: this.$http.adornUrl(`/algorithmInfo/disable`),
              method: 'post',
              data: this.$http.adornData({
                algorithmErrorType:'',
                id:row.id,
                lastRunTime:row.lastRunTime
              })
            })
            if(res.code!==0)return this.$message.error('禁用失败！')
            this.getSuanFa()
          this.$message({
            type: 'success',
            message: '禁用成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })        
        })
      }
    },
    add() {
      this.dialogVisible = true;
      this.addOrEditData={}
      this.title = "新增算法";
    },
     addOrEdit(addOrEditData){
       var api=this.title=='新增算法'?'/algorithmInfo/add':'/algorithmInfo/edit'
       this.$refs['addOrEditData'].validate(async vaild=>{
         if (valid) {
            const {data:res}=await this.$http({
              url: this.$http.adornUrl(api),
              method: 'post',
              data: {
                enableTimeBegin:this.addOrEditData.time?this.addOrEditData.time[0]&&handleDate(this.addOrEditData.time[0], "yyyy-MM-dd hh:mm:ss"):'',
                enableTimeEnd:this.addOrEditData.time?this.addOrEditData.time[1]&&handleDate(this.addOrEditData.time[1], "yyyy-MM-dd hh:mm:ss"):'',
                enableType:this.addOrEditData.enableType,
                ip:this.addOrEditData.ip,
                port:this.addOrEditData.port,
                algorithmName:this.addOrEditData.algorithmName,
                algorithmType:this.addOrEditData.algorithmType
              }
            })
      if(res&&res.code===0){
        this.dialogVisible=false
        this.getSuanFa()
      }
          } else {
            return false;
          }
       })
    },
    edit(row) {
      this.dialogVisible = true;
      this.addOrEditData=row
      this.title = "编辑算法";
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  margin-top: 20px;
  margin-left: 50%;
}
.el-tag {
  cursor: pointer;
}
</style>