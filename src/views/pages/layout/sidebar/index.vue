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
import { mapGetters } from 'vuex'
export default {
  components: { sidebarItem },
  data: () => ({
  }),
  computed: {
    isCollapse() {
      return false
    },
    ...mapGetters([
      'menus'
    ])
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
