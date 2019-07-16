
<template>
  <!-- eslint-disable vue/require-component-is-->
  <component v-bind="linkProps(to)">
    <slot/>
  </component>
</template>

<script>
// import { validateURL } from '@/utils/validate'

export default {
  props: {
    to: {type: String, required: true}
  },
  methods: {
    linkProps(url) {
      return {
        is: 'router-link',
        to: url
      }
    }
  }
}
</script>
