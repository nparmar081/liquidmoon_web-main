<template>
  <div>
    <select
      class="py-2.5 px-3 w-full text-sm bg-black rounded-md border border-secondary"
      :value="modelValue"
      @input="onChange">
      <option
        v-for="option in options"
        :key="option.value"
        class="text-white bg-black border border-purple"
        :value="option.value"
        :selected="modelValue === option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: [String, Number],
      default: 'listedPrice_asc',
    },
  },
  emits: ['update:modelValue'],
  methods: {
    onChange(event) {
      this.$emit('update:modelValue', event.target.value)
    },
  },

}
</script>
