<template>
  <el-form>
    <h2>布局设置</h2>
    <el-form-item label="导航条类型">
      <el-radio-group v-model="navbarLayoutType">
        <el-radio label="default" border>default</el-radio>
        <el-radio label="inverse" border>inverse</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="侧边栏皮肤">
      <el-radio-group v-model="sidebarLayoutSkin">
        <el-radio label="light" border>light</el-radio>
        <el-radio label="dark" border>dark</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- <el-form-item label="主题颜色"> -->
      <!-- <el-radio-group v-model="themeColor" @change="themeChange">
        <el-radio :label="'#17B3A3'" border>#17B3A3</el-radio>
        <el-radio :label="'#0BB2D4'" border>#0BB2D4</el-radio>
      </el-radio-group> -->
       <!-- <el-color-picker v-model="themeColor" @change="themeChange"></el-color-picker> -->
       <!-- <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" /> -->
    <!-- </el-form-item> -->
  </el-form>
</template>

<script>
import theme from '@/assets/scss/_variables.scss'
import ThemePicker from '@/components/ThemePicker'


  export default {
    components: { ThemePicker },
    data(){
      return {
        themeColor:'#17B3A3'
      }
    },
    computed: {
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType },
        set (val) { this.$store.commit('common/updateNavbarLayoutType', val) }
      },
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin },
        set (val) { this.$store.commit('common/updateSidebarLayoutSkin', val) }
      }
    },
    methods:{
      themeChange(val) {
        // console.log(val)
      this.$store.dispatch('common/changeSetting', {
        key: 'theme',
        value: val
        })
      },
    }
  }
</script>

