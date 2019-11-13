<template>
  <div style="padding:30px">
    <el-button type="primary" @click="showAddDialogVisible">新增</el-button>
    <!-- 表格区 -->
    <el-table :data="tableData" style="width: 100%;margin-top:30px">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="ip" label="服务地址">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}:{{scope.row.port}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="服务名称"></el-table-column>
      <el-table-column prop="runStatusValue" label="服务状态">
        <template slot-scope="scope">
          {{scope.row.runStatus==0?'在线':'不在线'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="edit(scope.row)">编辑</el-link>
            <el-link type="success" :underline="false" @click="statusChange(scope.row,$event)" v-if="scope.row.runStatus==1">启用</el-link>
            <el-link type="danger" :underline="false" @click="statusChange(scope.row,$event)" v-else>禁用</el-link>
          </template>
        </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" width="45%">
       <span slot="title">{{title}}</span>
      <el-form :model="addForm" ref="addForm" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="ip：" prop="ip">
              <el-input style="width:150px;" v-model="addForm.ip"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label="端口号：" prop="port">
              <el-input style="width:150px;" v-model="addForm.port"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务名称：" prop="name">
              <el-input style="width:150px;" v-model="addForm.name"></el-input>
            </el-form-item>
          </el-col>
         
        </el-row>
         <el-col :span="24">
            <el-form-item label="启用时间">
              <el-date-picker
                v-model="addForm.time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-if="addForm.enableType!=='3'"
              ></el-date-picker>
              <el-radio label="3" v-model="addForm.enableType">永久</el-radio>
              <el-radio label="2" v-model="addForm.enableType">立即</el-radio>
            </el-form-item>
          </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add">保存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {handleDate} from '@/utils/index'
export default {
  data() {
    return {
      dialogVisible: false,
       tableData: [],
       addForm:{
         ip:'',
         port:'',
         name:'',
         time:'',
         enableType:''
       },
       title:'',
        rules:{
        name:[{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
        ip:[{ required: true, message: 'ip不能为空', trigger: 'blur' }],
        // port:[{ required: true, message: '端口号不能为空', trigger: 'blur' }]
      }
    };
  },
  created(){
    this.getService()
  },
  methods: {
    async getService(){
      const {data:res}=await this.$http({
              url: this.$http.adornUrl('/sysService/list'),
              method: 'post',
              data: this.$http.adornData({
                pageSize:1000,
                pageNo:1
              })
            })
      if(res&&res.code===0){
        this.tableData=res.data.records
      }
    },
    showAddDialogVisible(){
      this.title='新增服务'
      this.addForm={
         ip:'',
         port:'',
         name:'',
         time:'',
         enableType:''
       }
      this.dialogVisible=true
    },
      add(){
       var api=this.title=='新增服务'?'/sysService/add':'/sysService/edit'
       this.$refs.addForm.validate(async valid => {
          if (!valid) return
          const {data:res}=await this.$http({
              url: this.$http.adornUrl(api),
              method: 'post',
              data: {
                enableTimeBegin:this.addForm.time[0]&&handleDate(this.addForm.time[0], "yyyy-MM-dd hh:mm:ss"),
                enableTimeEnd:this.addForm.time[1]&&handleDate(this.addForm.time[1], "yyyy-MM-dd hh:mm:ss"),
                enableType:1,
                ip:this.addForm.ip,
                port:this.addForm.port,
                name:this.addForm.name
              }
            })
      if(res&&res.code===0){
        // console.log(this.addForm)
        this.dialogVisible=false
        this.getService()
      }else{
        this.$message.error('新增失败！')
      }
       })
    },
    edit(row){
      this.addForm={
         ip:row.ip,
         port:row.port,
         name:row.name,
        //  time:[row.enableTimeBegin,row.enableTimeEnd],
        time:'',
         enableType:row.enableType
       }
      this.title='编辑服务'
      this.dialogVisible=true
    },
      statusChange(row,event){
      if (event.target.innerText=='启用') {
        this.$confirm('启用后该服务可使用，是否立即开启?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {data:res}=await this.$http({
              url: this.$http.adornUrl(`/sysService/enable?id=${row.id}`),
              method: 'post',
              data: this.$http.adornData({})
            })
            if(res.code!==0)return this.$message.error('启用失败！')
            this.getService()
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
         this.$confirm('禁用后该服务将不能使用，是否立即禁用?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
           const {data:res}=await this.$http({
              url: this.$http.adornUrl(`/sysService/disable?id=${row.id}`),
              method: 'post',
              data: this.$http.adornData({})
            })
            if(res.code!==0)return this.$message.error('禁用失败！')
            this.getService()
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
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  margin-left: 50%;
}
</style>