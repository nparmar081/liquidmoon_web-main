<template>
  <div class="relative focus-within:z-10 grow items-stretch rounded-md shadow-sm">
    <div
      class="flex absolute inset-y-0 items-center pointer-events-none"
      :class="isRightIconPosition ? 'right-0 pr-4' : 'left-0 pl-4'">
      <slot name="icon" />
    </div>
    <input
      :type="type"
      name="search"
      :min="min"
      :max="max"
      class="block py-2 w-full text-white bg-black rounded-lg border border-secondary"
      :class="[
        hasIcon && isRightIconPosition && 'pr-2',
        hasIcon && !isRightIconPosition && 'pl-10',
      ]"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      required: false,
      default: null,
    },
    type: {
      type: String,
      required: false,
      default: 'text',
    },
    iconPosition: {
      type: String, // left | right
      required: false,
      default: 'left',
    },
    min: {
      type: Number,
      required: false,
      default: null,
    },
    max: {
      type: Number,
      required: false,
      default: null,
    }
  },
  emits: ['update:modelValue'],
  computed: {
    hasIcon() {
      return !!this.$slots.icon
    },
    isRightIconPosition() {
      return this.iconPosition === 'right'
    },
  },
}
</script>
