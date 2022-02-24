<script setup>
 import { initWorkspace } from '@/composables/useWorkspace'
 initWorkspace()
</script>

<template>
  <div>
    <slot />
  </div>
</template>
