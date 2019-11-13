<template>
  <div style="padding:30px;">
    <!-- 搜索区 -->
    <el-form ref="buildForm" :model="buildForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="所属：">
            <el-select v-model="buildForm.organization" placeholder="请选择" clearable>
              <el-option
                v-for="item in organization"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="姓名：">
            <el-input v-model="buildForm.username" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="角色：">
            <el-select v-model="buildForm.name" placeholder="请选择" clearable >
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.remark"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :push="4">
          <el-button type="primary" @click='getUserList()'>搜索</el-button>
          <el-button type="primary" @click="add">新增</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格区 -->
    <el-table :data="tableData" style="width: 100%;margin-top:30px">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="organizationName" label="所属" width="180"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="sexValue" label="性别"></el-table-column>
      <el-table-column prop="name" label="账号"></el-table-column>
      <el-table-column prop="address" label="密码"></el-table-column>
      <el-table-column  label="角色">
        <template slot-scope="scope">
          <span v-for="item in scope.row.roles" :key="item.id">{{item.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" header-align="center" width="150">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="edit(scope.row)">编辑</el-link>
            <el-link type="success" :underline="false" @click="statusChange(scope.row,$event)" v-if="scope.row.status==1">启用</el-link>
            <el-link type="danger" :underline="false" @click="statusChange(scope.row,$event)" v-else>禁用</el-link>
          </template>
        </el-table-column>
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

    <el-dialog :visible.sync="dialogVisible" width="50%">
      <span slot="title">{{title}}</span>
      <el-form :model="editData" ref="editData" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="所属：">
              <el-select v-model="editData.organizationId" placeholder="请选择">
                <el-option
                  v-for="item in organization"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名：" prop="name">
              <el-input style="width:150px;" v-model="editData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别">
              <el-select v-model="editData.sex" placeholder="请选择">
                <el-option
                  v-for="item in gender"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="登录账号：" prop="phone">
              <el-input style="width:150px;" placeholder="使用手机号" v-model="editData.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码：" prop="password">
              <el-input style="width:150px;" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色">
              <el-select placeholder="请选择">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注：">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" style="width:400px;" v-model="editData.remark" maxlength="240"
  show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOrUpdate()">保存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername,validPassword,isMobile } from '@/utils/validate'

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if(value==''){
        callback(new Error('账号名不能为空'))
      }
      else if (!validUsername(value)) {
        callback(new Error('账号名仅支持阿拉伯数字、大小写字母'))
      } 
      else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
       if(value=='') {
        callback(new Error('密码不能为空'))
       }
      else if (!validPassword(value)) {
        callback(new Error('密码长度为6-32位，支持数字、大小写字母、@ ？ = . _，不允许空格'))
      } else {
        callback()
      }
    }
    const validatePhone=(rule,value,callback)=>{
      if(!isMobile(value)){
        callback(new Error('请输入11位格式正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      buildForm:{
        username:'',
        name:'',
        organization:''
      },
      organization:[],
      roleList:[],
      dialogVisible: false,
      tableData: [],
      title:'',
      editData:{},
      gender:[
        {
          value:1,
          label:'男'
        },
        {
          value:0,
          label:'女'
        }
      ],
      rules:{
        name:[{ required: true, trigger: 'blur',validator: validateUsername }],
        password:[{ required: true, trigger: 'blur',validator: validatePassword }],
        phone:[{ trigger: 'blur',validator: validatePhone }],
      },
       total: 0,
      pageSize: 10,
      currentPage: 1,
    }
  },
  created(){
    this.getUserList()
    this.getOrganization()
    this.getRole()
    // this.getPer()
    this.getsys()
  },
  methods: {
    // async getPer(){
    //   const {data:res}=await this.$http({
    //           url: this.$http.adornUrl(`/system/permission?pageNo=${this.currentPage}&pageSize=${this.pageSize}`),
    //           method: 'post',
    //           data: this.$http.adornData({
    //           })
    //         })
    //   if(res&&res.code===0){
       
    //   }
    // },
    async getsys(){
      const {data:res}=await this.$http({
        url:this.$http.adornUrl(`sysDict/list`),
        method:'post',
        data:this.$http.adornData({
          code:'',
          name:'',
          sysFlag:1
        })
      })
    },
    async getUserList(){
      const {data:res}=await this.$http({
              url: this.$http.adornUrl(`/sysUser/list?pageNo=${this.currentPage}&pageSize=${this.pageSize}`),
              method: 'post',
              data: this.$http.adornData({
                name:this.buildForm.name,
                username:this.buildForm.username,
                organizationId:this.buildForm.organization
              })
            })
      if(res&&res.code===0){
        this.tableData=res.data.records
        this.total=res.data.total
      }
    },
    async getOrganization(){
      const {data:res}=await this.$http({
              url: this.$http.adornUrl('/sysOrganization/list'),
              method: 'post',
              data: this.$http.adornData({
                pageSize:1000,
                pageNo:1
              })
            })
      if(res&&res.code===0){
        this.organization=res.data.records
      }
    },
    async getRole(){
      const {data:res}=await this.$http({
              url: this.$http.adornUrl('/sysRole/listAll'),
              method: 'post',
              data: this.$http.adornData({
                pageSize:1000,
                pageNo:1
              })
            })
      if(res&&res.code===0){
        // console.log(res.data)
        this.roleList=res.data
      }
    },
    add(){
      this.title='新增用户'
      this.editData={}
      this.dialogVisible=true
    },
    edit(row){
      this.title='编辑用户'
      this.dialogVisible=true
      this.editData=row
      // console.log(this.editData)
    },
    addOrUpdate(){
     let api=this.title=='新增用户'?'/sysUser/add':'/sysUser/edit' 
     let message=this.title=='新增用户'?'新增用户成功！':'修改用户成功！'
     let err=this.title=='新增用户'?'新增用户失败！':'修改用户失败！'
     this.$refs['editData'].validate(async (valid) => {
          if (valid) {
             const {data:res}=await this.$http({
              url: this.$http.adornUrl(api),
              method: 'post',
              data: this.$http.adornData({
                id:this.editData.id,
                name:this.editData.name,
                organizationId:this.editData.organizationId,
                remark:this.editData.remark,
                sex:this.editData.sex,
                username:this.editData.username,
              })
            })
            if(res.code!==0) return this.$message.error(err)
            this.$message.success(message)
            this.dialogVisible=false
            this.getUserList()
          } else {
            return false;
          }
        })
      },
    statusChange(row,event){
      if (event.target.innerText=='启用') {
        this.$confirm('启用后该账号可以登录进行相关操作，是否立即开启?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {data:res}=await this.$http({
              url: this.$http.adornUrl(`/sysUser/unLock?userId=${row.id}`),
              method: 'post',
              data: this.$http.adornData({})
            })
            if(res.code!==0)return this.$message.error('启用失败！')
            this.getUserList()
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
         this.$confirm('禁用后将不能登录系统，是否立即禁用?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
           const {data:res}=await this.$http({
              url: this.$http.adornUrl(`/sysUser/lock?userId=${row.id}`),
              method: 'post',
              data: this.$http.adornData({})
            })
            if(res.code!==0)return this.$message.error('禁用失败！')
            this.getUserList()
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
     handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUserList();
    },
  }
};
</script>

<style lang="scss" scoped>
.page {
  margin-top: 20px;
  margin-left: 50%;
}
</style>