<template>
  <div>
    <topbar />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <breadcrumb />
      <app-main />
    </div>
  </div>
</template>

<script>
import topbar from './topbar'
import sidebar from './sidebar'
import appMain from './app-main'
import breadcrumb from './breadcrumb'
export default {
  components: {topbar, sidebar, appMain, breadcrumb},
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>