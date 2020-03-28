<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      :background-color="backgroundColor"
      :text-color="textColor"
      :active-text-color="activeTextColor"
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
    ...mapGetters(['menus', 'theme']),
    backgroundColor: function() {
      if (this.theme === 'admin') {
        return '#394A60'
      } else if (this.theme === 'simple') {
        return '#fff'
      }
    },
    textColor: function() {
      if (this.theme === 'admin') {
        return '#fff'
      } else if (this.theme === 'simple') {
        return '#333'
      }
    },
    activeTextColor: function() {
      if (this.theme === 'admin') {
        return '#fff'
      } else if (this.theme === 'simple') {
        return '#333'
      }
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
