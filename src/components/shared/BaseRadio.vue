<template>
  <div class="flex items-center">
    <input
      type="radio"
      :id="id"
      :name="name"
      class="opacity-0 absolute h-8 w-8 disabled:cursor-not-allowed"
      :value="value"
      @input="check($event)"
      :checked="value === checked"
      :disabled="disabled"
    />
    <div
      class="bg-transparent border-2 rounded-md w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2"
      :class="
        disabled
          ? 'border-gray-500 focus-within:border-gray-500'
          : 'border-green-400 focus-within:border-primary'
      "
    >
      <svg
        class="fill-current hidden w-3 h-3 text-green-600 pointer-events-none"
        :class="disabled && 'text-gray-500'"
        version="1.1"
        viewBox="0 0 17 12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" fill-rule="evenodd">
          <g
            transform="translate(-9 -11)"
            fill="currentColor"
            fill-rule="nonzero"
          >
            <path
              d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z"
            />
          </g>
        </g>
      </svg>
    </div>
    <label
      for="A3-yes"
      class="select-none"
      :class="disabled && 'text-gray-500'"
    >
      <slot></slot>
    </label>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    value: {
      type: [String, Number, Boolean],
      required: false,
      default: null,
    },
    checked: {
      type: [String, Number],
      required: false,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    radio: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    id() {
      return `checkbox-${this._uid}`
    },
  },
  methods: {
    check(e) {
      console.log(e)
      this.$emit('change', e.target.value)
    },
  },
}
</script>

<style scoped>
input:checked + div {
  @apply border-primary;
}
input:checked + div svg {
  @apply block;
}
</style>
