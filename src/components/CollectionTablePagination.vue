<template>
  <v-pagination
    v-model="page"
    :pages="totalPages"
    :range-size="1"
    active-color="transparent"
    @update:modelValue="cb"
  />
</template>

<script>
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'
export default {
  components: {
    VPagination,
  },
  props: {
    currentPage: {
      type: Number,
      default: 0,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  computed: {
    page() {
      return this.currentPage + 1
    },
  },
  methods: {
    cb(page) {
      this.$emit('change-page', page - 1)
      window.scrollTo(0, top)
    },
  },
}
</script>

<style scoped>
.pagination {
  display: flex;
}

.pagination li {
  margin: 0 5px;
}

.pagination li.active {
  color: #14f195;
}

.Pagination .Page {
  color: #fff;
}

.Pagination .Page-active {
  color: #14f195;
  border: none;
}
</style>
