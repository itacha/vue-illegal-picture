<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-img"></div>
        <div class="brand-info">
          <h2 class="brand-info__text"><br>弘和人工智能交警违法图片处理平台</h2>
          <p class="brand-info__intro"></p>
        </div>
        <div class="login-main">
          <h3 class="login-title">登录</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="请输入帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password"  placeholder="请输入密码" ref="password" :type="passwordType"></el-input>
               <span class="show-pwd" @click="showPwd">
                  <icon-svg :name="passwordType === 'password' ? 'eye' : 'eyeopen'" ></icon-svg>
               </span>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
          <div class="login-footer">
            弘和集团  962666
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import { getUUID } from '@/utils'
import { validUsername,validPassword } from '@/utils/validate'

  export default {
    data () {
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
      return {
        dataForm: {
          userName: 'admin',
          password: '123456',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          userName: [
            { required: true, trigger: 'blur' ,validator: validateUsername }
          ],
          password: [
            { required: true,  trigger: 'blur',validator: validatePassword  }
          ]
        },
        passwordType:'password'
      }
    },
    created () {},
    methods: {
      showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/auth'),
              method: 'post',
              data: this.$http.adornData({
                'username': this.dataForm.userName,
                'password': this.dataForm.password
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$cookie.set('Authorization', data.data)
                this.$router.replace({ name: 'home' })
                // console.log(this.$cookie.get('Authorization'))
                // this.$router.push({path:'/home'})
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      // background-image: url(~@/assets/img/login_bg.jpg);
      background-image: url(~@/assets/img/banner-min.jpg);
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }
    .brand-img{
      width: 180px;
      height: 67px;
      background: url(~@/assets/img/logo3.png) no-repeat;
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      position: absolute;
      top: 0;
      right: 0;
      padding: 15% 60px 180px;
      width: 470px;
      min-height: 100%;
      background-color: #fff;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
    .show-pwd {
    position: absolute;
    right: 26px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
  .login-footer{
    position: absolute;
    top:90%;
    left: 50%;
    transform: translateX(-50%);
    font-weight: 700;
  }
  }
  
</style>
