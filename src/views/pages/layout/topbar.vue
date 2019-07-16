<template>
  <div class="topbar-container">
    <el-menu class="topbar" mode="horizontal">
      <span class="logo-img" style="padding-top:5px;float:left;height:50px;padding-left:10px;">
        <img src="@/assets/logo.png" style="width:40px;height:40px;" />
      </span>
      <span class="title-font">
        <a href="/#/system/personCenter">think-vue-admin</a>
      </span>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <i class="fa fa-user" style="font-size:18px;color:#394160;" aria-hidden="true"></i>
          <span style="font-size:16px;font-weight:800;cursor:pointer;color:#3a46e9">{{ loginInfo.loginName }}</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <span style="display:block;">个人信息</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginInfo: {
        loginName: 'admin'
      }
    }
  },
  computed: {
    logo() {
    }
  },
  created() {
  },
  methods: {
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
