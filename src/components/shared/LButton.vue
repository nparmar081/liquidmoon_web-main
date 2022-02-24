<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center px-3 py-1 border border-gray-600 font-medium rounded-lg shadow-sm hover:bg-brand-dark focus:outline-none"
    :class="classList"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'button',
    },
    variant: {
      type: String,
      required: false,
      default: null,
    },
    size: {
      type: String,
      default: 'md',
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classList() {
      if (this.active) {
        return 'border-primary text-primary'
      }

      if (this.variant === 'primary') {
        return 'bg-primary text-black'
      }

      return 'text-white bg-black'
    },
  },
}
</script>

<style></style>
