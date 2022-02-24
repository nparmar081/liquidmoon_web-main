<template>
  <button
    :class="klas"
    class="py-2 px-5 font-medium tracking-wider rounded-md">
    <div
      v-if="isLoading"
      class="flex gap-2 justify-center items-center">
      <LoadingIndicator /> {{ loadingText }}
    </div>
    <slot v-else />
  </button>
</template>

<script>
export default {
    name: 'BaseButton',
    props: {
        type: {
            type: String,
            default: 'primary'
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        loadingText: {
            type: String,
            default: null
        }
    },
    computed: {
        klas() {
            if (this.type == 'primary') {
                if (this.isLoading) {
                    return 'bg-accent-dark'
                }
                return 'text-black bg-accent-light hover:bg-accent-lighter'
            } else if (this.type == 'outline') {
                if (this.isLoading) {
                    return 'bg-accent-dark'
                }
                return 'text-white bg-transparent border border-gray-800 hover:bg-accent-darker hover:border-accent-dark'
            }
            return '';
        }
    },
}
</script>