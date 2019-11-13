<template>
  <div style="margin:20px;padding:30px">
    <el-button type="primary" icon="el-icon-back" circle @click="back" style="display:block"></el-button>
    <div class="container">
      <div class="title">
        <el-tag type="warning">故障</el-tag>
        <div>
          <el-button>刷新</el-button>
          <el-select v-model="value" placeholder="对点位进行操作">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="body">
        <div>设施代码：</div>
        <div>设施名称：</div>
        <div>设施地址：</div>
        <div>设备状态：</div>
        <div>最近操作时间：</div>
      </div>
      <div style="margin-top:20px;display:block;">
             <el-link type="primary" :underline="false">上一个故障</el-link>
             <el-link type="primary" :underline="false">下一个故障</el-link>
        </div>
    </div>
    <div class="judge">
      <p>判断依据</p>
      <div class="judge-title">
        <span>处理时间：</span>
        判断结果：
        <el-tag type="danger">损坏</el-tag>
      </div>
      <div class="judge-body">
        <div class="result">第一组原始图片 拍摄时间： 判断结果： <el-tag type="danger">损坏</el-tag></div>
        <div class="image-container">
          <el-image style="width: 280px; height: 240px"></el-image>
          <el-image style="width: 280px; height: 240px"></el-image>
          <el-image style="width: 280px; height: 240px"></el-image>
        </div>
        <div class="result">第二组原始图片 拍摄时间： 判断结果： <el-tag type="danger">损坏</el-tag></div>
        <div class="image-container">
          <el-image style="width: 280px; height: 240px"></el-image>
          <el-image style="width: 280px; height: 240px"></el-image>
          <el-image style="width: 280px; height: 240px"></el-image>
        </div>
        <div class="result">第三组原始图片 拍摄时间： 判断结果： <el-tag type="danger">损坏</el-tag></div>
        <div class="image-container">
          <el-image style="width: 280px; height: 240px"></el-image>
          <el-image style="width: 280px; height: 240px"></el-image>
          <el-image style="width: 280px; height: 240px"></el-image>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:['data','fun'],
  data() {
    return {
      options: [
        {
          label: "禁用",
          value: 0
        },
        {
          label: "启用",
          value: 1
        }
      ]
    };
  },
  methods:{
    back(){
      this.fun()
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  border: 1px solid #ccc;
  border-top: 30px solid #1890ff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  padding: 20px;
  .title {
    display: flex;
    justify-content: space-between;
  }
}
.body {
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0;
  div {
    width: 20%;
    line-height: 30px;
  }
}
.judge-body {
  border: 1px solid #ccc;
  padding:20px;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .result{
      margin-top: 15px;
  }
  .image-container{
    margin-top: 20px;
    .el-image{
      margin:0 10px;
    }
  }
}
.judge-title {
  background-color: #1890ff;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
}
</style>