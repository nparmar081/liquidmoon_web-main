<template>
  <div>
    <button class="p-3 border border-gray-700 rounded-l-md">
      <img src="@/assets/icons/grid-4.svg" class="h-4 w-4" />
    </button>
    <button class="p-3 border border-gray-700 border-l-0 rounded-r-md">
      <img src="@/assets/icons/grid-9.svg" class="h-4 w-4" />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    buttons: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
}
</script>

<style></style>
