<template>
  <div style="padding:30px;">
    <el-input placeholder="输入关键字进行过滤" style="width:300px;margin:20px 0;" v-model="filterText"></el-input>
    <el-tree
      :filter-node-method="filterNode"
      :data="tree"
      ref="tree"
      show-checkbox
      node-key="id"
      default-expand-all
      :props="defaultProps"
      :expand-on-click-node="false"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <el-input v-if="data.inputVisible" v-model="data.name" size="small"></el-input>
        <span v-else style="height:30px;line-height:30px;">{{ data.name }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => edit(node,data)"
            v-if="!data.inputVisible"
          >编辑</el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => {data.newNode?add(node,data):save(node,data)}"
            v-else
          >保存</el-button>
          <el-button type="text" size="mini" @click="() => append(data)">添加</el-button>
          <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
// let id = 1000;
export default {
  data() {
    return {
      tree: [],
      filterText: "",
      defaultProps: {
        children: "children",
        name: "name"
      }
    };
  },
  created() {
    this.getOrganization();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    async getOrganization() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl("/sysOrganization/node"),
        method: "post",
        data: this.$http.adornData({})
      });
      if (res && res.code === 0) {
        res.data[0] = this.setInput(res.data[0]);
        // console.log(res.data);
        this.tree = res.data;
      }
    },
    setInput(val) {
      if (!val) {
        return;
      }
      val.inputVisible = false;
      val.children &&
        val.children.forEach(element => {
          this.setInput(element);
        });
      return val;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    edit(node, data) {
      // console.log(node);
      // console.log(data);
      data.inputVisible = true;
    },
    async save(node, data) {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl("/sysOrganization/edit"),
        method: "post",
        data: this.$http.adornData({
          id: data.id,
          name: data.name,
          pid: data.pid,
          remark: ""
        })
      });
      data.inputVisible = false;
      if (res.code !== 0) return this.$message.error("编辑失败！");
      this.$message.success("修改成功！");
      this.getOrganization();
    },
    async add(node, data) {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl("/sysOrganization/add"),
        method: "post",
        data: this.$http.adornData({
          // id: data.id,
          name: data.name,
          pid: data.pid,
          remark: ""
        })
      });
      data.inputVisible = false;
      if (res.code !== 0) return this.$message.error("新增失败！");
      this.$message.success("新增成功！");
      this.getOrganization();
    },
    append(data) {
      const newChild = {
        // id: ,
        name: "新增组织",
        children: [],
        pid: data.id,
        inputVisible: true,
        newNode: true
      };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },
    remove(node, data) {
      this.$confirm("此操作将删除该组织及其下机构, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http({
            url: this.$http.adornUrl(`/sysOrganization/del?id=${data.id}`),
            method: "post",
            data: this.$http.adornData({})
          });
          if (res.code !== 0) return this.$message.error("删除失败！");
          this.getOrganization();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.custom-tree-node {
  height: 40px;
  line-height: 47px;
}
.el-tree-node__content{
  height: 40px;
}
</style>