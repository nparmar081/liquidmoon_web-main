<template>
  <div class="container py-16">
    <home :isWatchlist="true" />
  </div>
</template>

<script>
import home from "../views/Home.vue"
export default {
  components: {
    home
  },
}
</script>

<style></style>
