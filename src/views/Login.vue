<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_logo">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form 
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
    >
      <el-form-item prop="username">
        <el-input placeholder="请输入用户名" v-model="loginForm.username" prefix-icon="iconfont icon-user"/>
      </el-form-item>
      <el-form-item prop="password" >
        <el-input placeholder="请输入密码" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password" />
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" round @click="login">登录</el-button>
        <el-button type="info" round @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
      return {
        loginForm:{
          username: '',
          password: ''
        },
        loginFormRules: {
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
      };
    },
  methods: {
    login(){
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.post("login",this.loginForm)
        if(res.meta.status !== 200){
          this.$message.error('登录失败')
        }else{
          this.$message.success('登录成功');
          window.sessionStorage.setItem('token', res.data.token)
          setTimeout(() => {
            this.$router.push('/home');
          },1000)
        }
      })
    },
    resetForm(){
      this.$refs.loginFormRef.resetFields();
    }
  }  
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
}
.login_logo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  box-shadow: 0 0 10px #dddddd;
  padding: 10px;
  font-size: 0;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    border-radius: 50%;
    background-color: #eeeeee;
  }
}
.login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;

      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
</style>