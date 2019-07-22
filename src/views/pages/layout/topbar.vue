<template>
  <div class="topbar-container">
    <el-menu class="topbar" mode="horizontal">
      <span class="logo-img" style="padding-top:5px;float:left;height:50px;padding-left:10px;">
        <img src="@/assets/logo.png" style="width:40px;height:40px;" />
      </span>
      <span class="title-font">
        <a href="/#/main/index">SwaggerUI</a>
      </span>
      <div class="avatar-container">
        <tc-button size="small" type="think" @click="openSwaggerInfo">swagger信息</tc-button>
      </div>
    </el-menu>
    <tc-dialog loading :title="swaggerInfoDialog.title" :visible.sync="swaggerInfoDialog.show" width="600px" height="400px">
      <swaggerInfo />
    </tc-dialog>
  </div>
</template>

<script>
import swaggerInfo from './swagger-info'
export default {
  components: { swaggerInfo },
  data() {
    return {
      swaggerInfoDialog: {
        show: false,
        title: 'swagger信息'
      }
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    openSwaggerInfo() {
      this.swaggerInfoDialog.show = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$topbar-height: 50px;
$title-color:#29292a;
.topbar-container {
  height: $topbar-height;
}
.topbar {
  height: $topbar-height;
  line-height: $topbar-height;
  border-radius: 0px !important;
  background-color: #fff;
  .title-font {
    color: $title-color;
    font-size: 18px;
    line-height: $topbar-height;
    padding-left: 10px;
    font-weight: 800;
    float: left;
    a{
      text-decoration: none;
      color:$title-color;
    }
  }
  .avatar-container {
    height: $topbar-height;
    display: inline-block;
    position: absolute;
    right: 15px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
    }
  }
}
</style>
