<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane v-for="name in tabs" :label="tabName(name)" :name="name" :key="name">
        <div class="swagger-title">{{reqMethod.summary}}</div>
        {{reqMethod}}
      </el-tab-pane>
    </el-tabs>
    <div>
      
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: ''
    }
  },
  mounted() {
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'menus'
    ]),
    menuInfo() {
      if (this.menus === null) {
        return null
      }
      const parentMenu = this.menus[this.$route.query.pindex]
      if (parentMenu === null) {
        return null
      }
      return parentMenu.children[this.$route.query.index]
    },
    tabs() {
      if (this.menuInfo === null) {
        return []
      }
      const reqMethod = this.menuInfo.reqMethod
      const tabs = Object.keys(reqMethod)

      this.activeName = tabs[0]
      return tabs
    },
    reqMethod() {
      if (this.menuInfo === null) {
        return {}
      }
      return this.menuInfo.reqMethod[this.activeName] || {}
    }
  },
  methods: {
    tabName(name) {
      const reqMethod = this.menuInfo.reqMethod[name] || {}
      return reqMethod.summary + '-' + name
    }
  }

}
</script>

<style lang="scss" scoped>

</style>