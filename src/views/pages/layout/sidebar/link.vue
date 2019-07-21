
<template>
  <component v-bind="linkProps(to,param)">
    <slot/>
  </component>
</template>

<script>

export default {
  props: {
    to: {type: String, required: true},
    param: {type: Object, required: false}
  },
  methods: {
    linkProps(to, param) {
      return {
        is: 'router-link',
        to: {path: '/main/index', query: param }
      }
    }
  }
}
</script>
