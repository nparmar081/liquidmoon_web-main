<template>
  <div
    class="bg-secondary rounded-lg p-4 font-mono text-center w-full"
    :class="active && 'border border-primary'"
  >
    <h5 class="uppercase text-xs">{{ title }}</h5>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Card',
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
h5 {
}
</style>
