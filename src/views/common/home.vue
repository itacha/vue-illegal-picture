<template>
  <div class="mod-home">
    <el-row :gutter="20">
      <el-col :span="5" class="item">
        <div class="item-container">
          <div>
            <span>算法状态（个）</span>
            <el-link type="primary" :underline="false" @click="toOther('/algorithm-total')">查看更多</el-link>
          </div>
          <div>
            <span>
              在线
              <!-- <i>{{algorithmInfo.onlineNum?algorithmInfo.onlineNum:0}}</i> -->
              <i> <count-to :start-val="0" :end-val="algorithmInfo.onlineNum?algorithmInfo.onlineNum-0:0" :duration="3600"  /></i>
            </span>
            <span>
              不在线
              <!-- <i>{{algorithmInfo.offlineNum?algorithmInfo.offlineNum:0}}</i> -->
              <i><count-to :start-val="0" :end-val="algorithmInfo.offlineNum?algorithmInfo.offlineNum-0:0" :duration="3600" class="card-panel-num" /></i>
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="5" class="item">
        <div class="item-container">
          <div>
            <span>点位状态（个）</span>
            <el-link type="primary" :underline="false" @click="toOther('/pointmanage-build')">查看更多</el-link>
          </div>
          <div>
            <span>
              正常
              <!-- <i>{{device.onlineNum?device.onlineNum:0}}</i> -->
              <i><count-to :start-val="0" :end-val="device.onlineNum?device.onlineNum-0:0" :duration="3600"  /></i>
            </span>
            <span>
              故障
              <!-- <i>{{device.offlineNum?device.offlineNum:0}}</i> -->
              <i><count-to :start-val="0" :end-val="device.offlineNum?device.offlineNum-0:0" :duration="3600" class="card-panel-num" /></i>
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="5" class="item">
        <div class="item-container">
          <div>
            <span>设施设备状态（个）</span>
            <el-link
              type="primary"
              :underline="false"
              @click="toOther('/facilities')"
            >查看更多</el-link>
          </div>
          <div>
            <span>
              正常
              <!-- <i>{{safetyFacilities.onlineNum?safetyFacilities.onlineNum:0}}</i> -->
              <i><count-to :start-val="0" :end-val="safetyFacilities.onlineNum?safetyFacilities.onlineNum-0:0" :duration="3600"  /></i>
            </span>
            <span>
              故障
              <!-- <i>{{safetyFacilities.offlineNum?safetyFacilities.offlineNum:0}}</i> -->
              <i><count-to :start-val="0" :end-val="safetyFacilities.offlineNum?safetyFacilities.offlineNum-0:0" :duration="3600" class="card-panel-num" /></i>
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="5" class="item">
        <div class="last-card">
          <div>
            <span>图片处理（张））</span>
            <!-- <p>{{picDetail.picNum?picDetail.picNum:0}}</p> -->
            <p><count-to :start-val="0" :end-val="picDetail.picNum?picDetail.picNum-0:0" :duration="3600" /></p>
          </div>
          <div>
            <span>耗时（小时）</span>
            <!-- <p>{{picDetail.expendLongTime?picDetail.expendLongTime:0}}</p> -->
            <p><count-to :start-val="0" :end-val="picDetail.expendLongTime?picDetail.expendLongTime-0:0" :duration="3600" :decimals="2" /></p>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 表单搜索区域 -->
    <el-form :inline="true" size="small" class="queryForm">
      <el-form-item>
        <el-radio-group v-model="type" @change="search">
          <el-radio-button
            v-for="item in typeList"
            :key="item.value"
            :label="item.value"
          >{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 图表区域 -->
    <el-row :gutter="30">
      <el-col :span="8">
        <div class="inner">
          <div class="title">
            <p>违法代码当前合格数据统计Top5</p>
          </div>
          <div id="pieChart1" :style="{width: '100%', height: '370px'}"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="inner">
          <div class="title">
            <p>不合格图片总量分析</p>
          </div>
          <div style="padding:50px;">
            <el-progress type="circle" :percentage="percentage" :width="260" :stroke-width="22"></el-progress>
            <span class="number">不合格图片数量：{{unQualifyNumber}}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="inner">
          <div class="title">
            <p>算法筛查结果分析</p>
          </div>
          <div id="pieChart2" :style="{width: '100%', height: '370px'}"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie");
// require("echarts/lib/chart/line");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
// require("echarts/lib/component/dataZoom");
// import echarts from "echarts";
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      percentage: 0,
      unQualifyNumber: 0,
      typeList: [
        { label: "今日", value: "2" },
        { label: "本周", value: "3" },
        { label: "本月", value: "4" },
        { label: "本季", value: "5" },
        { label: "本年", value: "7" }
      ],
      type: 2,
      time: "",
      algorithmInfo: "",
      device: "",
      safetyFacilities: "",
      picDetail: "",
      pieChart1: null,
      pieChart2: null,
      pieChart1Data: "",
      pieChart2Data: ""
      // chartBar:null
    };
  },
  created() {
    this.getAlgorithmInfo();
    this.getDevice();
    this.getSheBei();
    this.getPicDetail();
    // this.getIllegalCode()
  },
  mounted() {
    // this.draw()
    this.getIllegalCode();
    this.getUnQualify();
    this.algorithmInfoResult();
  },
  methods: {
    async getAlgorithmInfo() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl("/dashboard/algorithmInfo"),
        method: "post",
        data: this.$http.adornData({
          pageSize: 1000,
          pageNo: 1
        })
      });
      if (res && res.code === 0) {
        this.algorithmInfo = res.data;
      }
    },
    async getDevice() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl("/dashboard/device"),
        method: "post",
        data: this.$http.adornData({
          pageSize: 1000,
          pageNo: 1
        })
      });
      if (res && res.code === 0) {
        this.device = res.data;
      }
    },
    async getSheBei() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl("/dashboard/safetyFacilities"),
        method: "post",
        data: this.$http.adornData({
          pageSize: 1000,
          pageNo: 1
        })
      });
      if (res && res.code === 0) {
        this.safetyFacilities = res.data;
      }
    },
    async getPicDetail() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl("/dashboard/picDetail"),
        method: "post",
        data: this.$http.adornData({
          pageSize: 1000,
          pageNo: 1
        })
      });
      if (res && res.code === 0) {
        this.picDetail = res.data;
      }
    },
    draw() {
      this.pieChart1 = echarts.init(document.getElementById("pieChart1"));
      this.pieChart1.clear();
      this.pieChart1.setOption(this.pieChart1Data);
    },
    draw2(){
        this.pieChart2 = echarts.init(document.getElementById("pieChart2"));
      this.pieChart2.clear();
      this.pieChart2.setOption(this.pieChart2Data);
    },
    async getIllegalCode() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl("/dashboard/illegalCode"),
        method: "post",
        data: this.$http.adornData({
          pageSize: 1000,
          pageNo: 1
        })
      });
      if (res && res.code === 0) {
        // this.pieChart1Data = res.data
        let option1 = res.data;
        this.pieChart1Data = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          color:['#49a9ee','#98d87d','#ffd86e','#f3857b','#8996e6'],
          legend: {
            orient: "vertical",
            x: "left",
            data: option1
          },
          series: [
            {
              name: "违法代码",
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center",
                  formatter: " {c}次"
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "30",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: option1
            }
          ]
        };
        // console.log(this.pieChart1Data)
        this.draw();
      }
    },
    async getUnQualify() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl("/dashboard/unQualify"),
        method: "post",
        data: this.$http.adornData({
          pageSize: 1000,
          pageNo: 1
        })
      });
      if (res && res.code !== 0) return this.$message("请求数据失败!");
      this.percentage = res.data.ratio - 0;
      this.unQualifyNumber = res.data.num;
    },
    async algorithmInfoResult() {
      const { data: res } = await this.$http({
        url: this.$http.adornUrl("/dashboard/algorithmInfoResult"),
        method: "post",
        data: this.$http.adornData({})
      });
      if (res && res.code !== 0) return this.$message("数据获取失败！");
      let option2 = res.data;
      this.pieChart2Data = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color:['#409eff','#ffd86e','#98d87d'],
        legend: {
          orient: "vertical",
          left: "left",
          data: option2
        },
        series: [
          {
            name: "算法筛查结果",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: option2,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }
      this.draw2()
    },
    search() {},
    toOther(path) {
      this.$router.push({ path });
    }
  },
  computed: {
    // options1(){
    //   let that=this
    //   console.log(that.pieChart1Data)
    //   console.log(option)
    //   return option
    // }
  }
};
</script>

<style>
.mod-home {
  line-height: 1.5;
}
</style>
<style lang="scss" scoped>
.el-card {
  margin: 10px;
}
.item {
  height: 112px;
  border: 1px solid #ccc;
  
  margin: 10px;
}
.item-container {
  padding: 10px;
  div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    span {
      font-weight: 700;
    }
  }
  div:nth-child(2) {
    margin-top: 28px;
    display: flex;
    justify-content: space-around;
    span:nth-child(1) {
      color: rgba(3, 182, 21, 0.972549019607843);
    }
    span:nth-child(2) {
      color: #f59a23;
    }
    i {
      font-size: 30px;
      font-style: normal;
       .card-panel-num{
      color: #f59a23;
  }
    }
  }
}
.last-card {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  p {
    font-weight: 700;
    font-size: 24px;
  }
}
.queryForm {
  margin: 20px 0;
}
.inner {
  border: 1px solid #ccc;
  min-height: 422px;
  .title {
    border-bottom: 1px solid #ccc;
    padding-left: 10px;
    p {
      font-weight: 700;
    }
  }
  .number {
    position: absolute;
    left: 54%;
    top: 50%;
    font-size: 18px;
  }
}
</style>

