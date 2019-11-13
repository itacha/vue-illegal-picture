<template>
  <div style="padding:20px;">
    <el-row style="margin:30px 0">
      <el-col>
        <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
      </el-col>
    </el-row>

    <el-table :data="rolelist" style="width: 100%" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="name"></el-table-column>
      <el-table-column label="角色描述" prop="remark"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditRoleDialog(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delRole(scope.row.id)"
          >删除</el-button>
          <el-button
            type="warning"
            icon="el-icon-setting"
            size="mini"
            @click="showSetRightstDialog(scope.row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="30%"
      @close="addRoleDialogClose"
    >
      <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="90px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="30%"
      @close="editRoleDialogClose"
    >
      <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="90px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightstDialogVisible"
      width="50%"
      @close="setRightsDialogClose"
    >
      <el-tree
        :data="rightslist"
        :props="treeProps"
        node-key="id"
        default-expand-all
        show-checkbox
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightstDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let id = 1000;
export default {
  data() {
    return {
      rolelist: [],
      setRightstDialogVisible: false,
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      rightslist: [],
      treeProps: {
        children: "children",
        label: "name"
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: "",
      addForm: {
        name: "",
        remark: ""
      },
      addFormRules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }]
      },
      editForm: {},
      editFormRules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getRolesList();
    this.setRight();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl("/sysRole/list"),
        method: "post",
        data: this.$http.adornData({
          pageSize: 100,
          pageNo: 1
        })
      });
      if (res && res.code !== 0) return this.$message.error("获取角色列表失败");
      this.rolelist = res.data.records;
    },
    setRightsDialogClose() {
      this.defKeys = [];
      this.setRightstDialogVisible = false;
    },
    async setRight() {
    //   this.roleId = role.id;
      //   const { data: res } = await this.$http.get('/rights/tree')
      //   if (res.meta.status !== 200) return this.$message.error('获取权限列表失败!')
    //   this.rightslist = res.data;
      // this.addInput(this.rightslist)
    //   this.setLayer(this.rightslist);
      // this.rightslist.forEach(item=>{
      //   item.inputVisible=false
      //   item.inputValue=''
      // })
    //   console.log(this.rightslist);
      // this.getLeafNodeId(role, this.defKeys)
    },
    async showSetRightstDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http({
        url: this.$http.adornUrl(`/sysRole/detail?id=${role.id}`),
        method: "post",
        data: this.$http.adornData({})
      })
        if (res.code !== 0) return this.$message.error('获取权限列表失败!')
        this.rightslist = res.data
        this.getLeafNodeId(role, this.defKeys)
    //   console.log(this.defKeys);
      this.setRightstDialogVisible = true;
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafNodeId(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      console.log(node.children);
      node.children.forEach(element => {
        this.getLeafNodeId(element, arr);
      });
    },
    async saveRights() {
      // console.log(this.$refs.treeRef.getCheckedKeys());
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      console.log(keys);
      const keysStr = keys.join(",");
      // console.log(keysStr)
      
      const {data:res}=await this.$http({
        url: this.$http.adornUrl(`/sysRole/config`),
        method: "post",
        data: this.$http.adornData(
            [
                {
                    //  permissionId:keysStr,
                     permissionId:3,
                    roleId:this.roleId
                },
                {
                    //  permissionId:keysStr,
                     permissionId:1,
                    roleId:this.roleId
                },
                 {
                    //  permissionId:keysStr,
                     permissionId:2,
                    roleId:this.roleId
                }
            ]
        ,false)
      })
      if (res.code !== 0)
        return this.$message.error("更新用户权限失败！");
      this.$message.success("分配权限成功！");
      this.getRolesList();
      this.setRightstDialogVisible = false;
    },
    addRoleDialogClose() {
      this.addRoleDialogVisible = false;
      this.$refs.addFormRef.resetFields();
    },
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http({
          url: this.$http.adornUrl("/sysRole/add"),
          method: "post",
          data: this.$http.adornData({
            name: this.addForm.name,
            remark: this.addForm.remark
          })
        });
        if (res.code !== 0) return this.$message.error("添加角色失败！");
        this.addRoleDialogVisible = false;
        this.getRolesList();
      });
    },
    editRoleDialogClose() {
      this.editRoleDialogVisible = false;
      this.$refs.editFormRef.resetFields();
    },
    showEditRoleDialog(row) {
      this.editForm = row;
      this.editRoleDialogVisible = true;
    },
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http({
          url: this.$http.adornUrl("/sysRole/edit"),
          method: "post",
          data: this.$http.adornData({
            id: this.editForm.id,
            name: this.editForm.name,
            remark: this.editForm.remark
          })
        });
        if (res.code !== 0) return this.$message.error("编辑角色失败！");
        this.editRoleDialogVisible = false;
        this.getRolesList();
      });
    },
    async delRole(id) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmRes == "cancel") return this.$message.info("已取消删除");
      const { data: res } = await this.$http({
        url: this.$http.adornUrl(`/sysRole/delete?id=${id}`),
        method: "post",
        data: this.$http.adornData({})
      });
      if (res.code !== 0) return this.$message.error("删除角色失败！");
      this.getRolesList();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.y-center {
  display: flex;
  align-items: center;
}
</style>
