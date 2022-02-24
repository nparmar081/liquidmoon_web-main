<template>
  <div>
    <div
      @click="toggle"
      class="bg-gray-900 p-3 flex items-center justify-between cursor-pointer mb-2 rounded-md"
    >
      <slot></slot>
      <ChevronDownIcon v-if="!isShow" class="text-gray-300 h-8 w-8" />
      <ChevronUpIcon v-else class="text-gray-300 h-8 w-8" />
    </div>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <section v-show="isShow" class="p-3 bg-gray-900 rounded-md">
        <slot name="content"></slot>
      </section>
    </transition>
  </div>
</template>

<script>
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/solid'

export default {
  props: {
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
  components: {
    ChevronDownIcon,
    ChevronUpIcon,
  },
  data: () => ({
    isShow: false,
  }),
  methods: {
    toggle() {
      this.isShow = !this.isShow
      if (this.isShow) {
        this.$emit('onShow')
      }
    },
  },
  created() {
    this.isShow = this.defaultOpen
  }
}
</script>

<style></style>
