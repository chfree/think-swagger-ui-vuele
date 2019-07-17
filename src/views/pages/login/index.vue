<template>
  <div class="login-container">
    <div class="login-card">
      <tc-form class="login-form" label-width="120px">
        <div class="title-container">
          <h3 class="title">swagger-ui</h3>
        </div>
        <div class="login-form-content">
          <tc-form-item label="swagger路径">
            <tc-input ref="swaggerPath" v-model="swaggerPath" placeholder="swagger path" auto-complete="off"/>
          </tc-form-item>
          <tc-button :loading="loading" type="primary" class="loginButton" @click="login">访问</tc-button>
        </div>
      </tc-form>
    </div>
  </div>
</template>

<script>
import swaggerService from '@/api/swagger'
export default {
  data() {
    return {
      swaggerPath: '/v2/api-docs',
      loading: false
    }
  },
  methods: {
    login() {
      swaggerService.reqSwagger(this.swaggerPath).then(result => {
        console.log(result)
      })
      // this.$router.push({ path: '/system/personCenter' })
    }
  }
}
</script>

<style lang="scss">
$bg:#283443;
.login-container{
  background-color: $bg;
  height: 100vh;
}
$login-card-width:600px;
$login-card-height:270px;
.login-card{
  position: absolute;
  width: $login-card-width;
  height: $login-card-height;
  background-color: #fff;
  border:1px solid #333;
  border-radius: 5px;
  left: 50%;
  top: 45%;
  margin-left: -$login-card-width/2;
  margin-top: -$login-card-height/2;
}

 .title-container {
  .title {
    font-size: 26px;
    margin: 10px auto 30px auto;
    text-align: center;
    font-weight: bold;
  }
}
.login-form{
  .login-form-content{
    padding: 0px 40px 0px 0px;
    .loginButton{
      width:calc(100% - 120px);
      margin-bottom:10px;
      margin-left: 120px;
    }
  }
}

</style>