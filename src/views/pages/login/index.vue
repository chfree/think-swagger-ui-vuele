<template>
  <div class="login-container">
    <div  v-if="visitMode==='url'" class="login-card">
      <tc-form class="login-form" label-width="120px">
        <div class="title-container">
          <h3 class="title">swagger-ui</h3>
        </div>
        <div class="login-form-content">
          <tc-form-item label="swagger路径" style="margin-bottom:50px;">
            <tc-input style="width:69%" ref="swaggerPath" v-model="swaggerPath" placeholder="swagger path" auto-complete="off"/>
            <tc-button style="width:30%" type="default" @click="visitMode='json'">JSON模式</tc-button>
          </tc-form-item>
          <tc-button :loading="loading" type="primary" class="loginButton" @click="login">访问</tc-button>
        </div>
      </tc-form>
    </div>
    <div  v-if="visitMode==='json'" class="login-card">
      <tc-form class="login-form" label-width="120px">
        <div class="title-container">
          <h3 class="title">swagger-ui</h3>
        </div>
        <div class="login-form-content">
          <tc-form-item label="json数据" style="">
            <tc-input style="width:69%" ref="swaggerJson" v-model="swaggerPath" placeholder="swagger path" auto-complete="off"/>
            <tc-button style="width:30%" type="default" @click="visitMode='json'">URL模式</tc-button>
          </tc-form-item>
          <tc-button :loading="loading" type="primary" class="loginButton" @click="resolve">解析数据</tc-button>
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
      visitMode: 'url',
      swaggerPath: 'http://localhost:8002/v2/api-docs',
      loading: false
    }
  },
  methods: {
    login() {
      swaggerService.reqAndResolveSwagger(this.swaggerPath).then(result => {
        if (result.swagger !== undefined) {
          this.$router.push({ path: '/main/index' })
        }
      })
    },
    resolve() {
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
$login-card-height:250px;
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