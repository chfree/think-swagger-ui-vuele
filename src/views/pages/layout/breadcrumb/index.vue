<template>
  <div style="height:29px;border-bottom:1px solid #e6e6e6;padding-left:10px;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="pl in pathLocation" :key="pl">{{pl}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  computed: {
    pathLocation: function() {
      var pathLocal = []
      Array.from(this.$route.matched).forEach(route => {
        pathLocal.push(Object.assign({}, route.meta).title)
      })
      return pathLocal
    }
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb{
  line-height: 30px;
}
</style>