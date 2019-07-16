<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#394A60"
      text-color="#fff"
      active-text-color="#fff"
    >
      <sidebar-item v-for="route in menus" :key="route.key" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import sidebarItem from './sidebar-item'
export default {
  components: { sidebarItem },
  data: () => ({
    menus: []
  }),
  computed: {
    isCollapse() {
      return false
    }
  }
}
</script>
<style lang="scss">
.router-link-active{
  li.is-active{
    background-color: #283443 !important;
  }
}
</style>
