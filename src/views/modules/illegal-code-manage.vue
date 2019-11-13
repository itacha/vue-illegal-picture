<template>
  <div style="padding:30px;">
    <el-row :gutter="20">
      <el-col :span="8">
        <p>违法代码</p>
        <el-input placeholder="搜索" suffix-icon="el-icon-search" v-model="codename" @change="search" @keyup.enter="search"></el-input>
        <div class="code-body">
          <div v-for="item in dynamicTags" :key="item.id">
            <!-- <el-input v-if="item.inputVisible" style="width:100px;" v-model="item.value"></el-input>   -->
            <el-tag>{{item.value}}</el-tag>
            <i class="el-icon-edit" @click="edit(item)"></i>
            <i class="el-icon-remove-outline" @click="remove(item)"></i>
            <i class="el-icon-circle-plus-outline" @click="add"></i>
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="border-left:1px solid #ccc;border-right:1px solid #ccc;min-height:300px;">
          <p>违法代码名称</p>
          <el-input v-model="selectCode.value"></el-input>
      </el-col>
      <el-col :span="8">
          <p>分配算法：</p>
          <el-select v-model="selectCode.suan" multiple placeholder="请选择">
    <el-option
      v-for="item in nameList"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
      </el-col>
    </el-row>
    <el-button style="margin-left:50%;transform:translateX(-50%);margin-top:20px;" type="primary" @click="save">保存</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      inputVisible:false,
      dynamicTags: [
        {
          id:1,
          value: '选项1',
          inputVisible:false,
          suanfa:[]
        }, 
        {
          id:2,
          value: '选项2',
          inputVisible:false,
          suanfa:[]
        }
      ],
      nameList: [],
      selectCode:{},
      codename:''
    };
  },
  created(){
    this.getName()
    // this.search()
  },
  methods: {
    async getName() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl(`/algorithmInfo/nameList?pageNo=1&pageSize=100`),
        method: "post",
        data: this.$http.adornData({})
      });
      if (res && res.code === 0) {
        this.nameList = res.data;
      }
    },
    search(){},
    edit(item){
        item.inputVisible=true
        this.selectCode=item
    },
    remove(row){
        this.$confirm(
        '该违法代码可能与点位配置相关联，删除会导致该点位此功能无法使用。您确认进行当前操作吗？',
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
    },
    add(){},
    save(){}
  }
};
</script>    
<style lang="scss" scoped>
.code-body {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  div{
      margin:10px;
  }
}
</style>