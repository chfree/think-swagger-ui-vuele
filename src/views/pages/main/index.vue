<template>
  <div>
    <h1>index1</h1>
    <h2>{{this.menus[$route.query.pindex].children[$route.query.index]}}</h2>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
    }
  },
  mounted() {
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'menus'
    ])
  },
  methods: {
  }

}
</script>

<style lang="scss" scoped>

</style>