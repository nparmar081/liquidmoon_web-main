<template>
  <div class="flex items-center">
    <input
      :id="id"
      v-model="checked"
      type="checkbox"
      class="absolute w-5 h-5 opacity-0"
      :name="name"
      :value="value"
      :disabled="disabled"
      @change="check">
    <div
      class="flex shrink-0 justify-center items-center mr-2 w-5 h-5 bg-transparent rounded-md border-2"
      :class="
        disabled ? 'border-gray-500 focus-within:border-gray-500' : checked ? 'border-accent-light focus-within:border-accent-light':'border-accent-dark focus-within:border-accent-dark'
      ">
      <svg
        v-if="checked"
        class="w-3 h-3 text-green-600 pointer-events-none fill-current"
        :class="disabled && 'text-gray-500'"
        version="1.1"
        viewBox="0 0 17 12"
        xmlns="http://www.w3.org/2000/svg">
        <g
          fill="none"
          fill-rule="evenodd">
          <g
            transform="translate(-9 -11)"
            fill="currentColor"
            fill-rule="nonzero">
            <path
              d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
          </g>
        </g>
      </svg>
    </div>
    <label
      for="A3-yes"
      class="select-none"
      :class="disabled && 'text-gray-500'">
      <slot />
    </label>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: false,
      default: null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    modelValue: {
      type: [Array],
      required: false,
      default: () => [],
    },
    value: {
      type: [String, Number],
      required: false,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  data: () => ({
    uid: null,
  }),
  computed: {
    id() {
      return `checkbox-${this.uid}`
    },
    checked() {
      if (!this.value) return false
      return this.modelValue.includes(this.value)
    },
  },
  mounted() {
    this.uid =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
  },
  methods: {
    check() {
      let isChecked = event.target.checked
      let newValue = [...this.modelValue]
      if (isChecked) {
        newValue.push(this.value)
      } else {
        newValue.splice(newValue.indexOf(this.value), 1)
      }

      this.$emit('update:modelValue', newValue)
    },
  },
}
</script>
