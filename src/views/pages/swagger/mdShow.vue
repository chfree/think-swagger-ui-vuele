<template>
  <div contenteditable="true" style="width:100%;height:550px;border:1px solid #ddd;outline:none;">
    <div v-html="mdContent"></div>
  </div>
</template>

<script>
export default {
  props: {
    mdContent: {type: String, required: false, default: ''}
  }
}
</script>

<style lang="scss" scoped>

</style>