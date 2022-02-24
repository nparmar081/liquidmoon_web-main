<template>
  <div>
    <div
      @click="toggle"
      class="bg-gray-800 p-3 flex items-center justify-between cursor-pointer"
    >
      <span class="flex items-center">
        <img v-if="icon" src="@/assets/icons/list.svg" class="h-5 w-5 mr-3" />
        {{ title }}
      </span>
      <span v-if="!isShow" class="text-xl">+</span>
      <span v-else class="text-xl">-</span>
    </div>
    <section v-show="isShow" class="p-3">
      <slot></slot>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: Boolean,
      required: false,
      default: false,
    },
    defaultOpen: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data: () => ({
    isShow: true,
  }),
  methods: {
    toggle() {
      this.isShow = !this.isShow
    },
  },
  created() {
    this.isShow = this.defaultOpen
  }
}
</script>

<style></style>
