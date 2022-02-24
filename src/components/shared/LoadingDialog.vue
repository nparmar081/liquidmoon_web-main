<template>
  <TransitionRoot
    as="template"
    :show="open">
    <div
      class="overflow-y-auto fixed inset-0 z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true">
      <div class="flex justify-center items-end px-4 pt-4 pb-20 min-h-screen text-center sm:block sm:p-0">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true" />
        </TransitionChild>
        <span
          class="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true">&#8203;</span>
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div class="inline-block overflow-hidden px-4 pt-5 pb-4 text-left text-white align-bottom bg-brand-darker rounded-lg shadow-xl transition-all transform sm:py-12 sm:px-6 sm:my-8 sm:w-full sm:max-w-sm sm:align-middle">
            <div>
              <div class="flex justify-center items-center mx-auto w-16 h-16 bg-accent-lighter rounded-full">
                <LoadingIndicator class="w-8 h-8 text-brand-dark" />
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <h3
                  id="modal-title"
                  class="text-lg font-medium leading-6 text-white">
                  {{ title }}
                </h3>
                <div
                  v-if="message"
                  class="mt-2">
                  <p class="text-sm text-gray-400">
                    {{ message }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TransitionChild>
      </div>
    </div>
  </TransitionRoot>
</template>

<script>
import {
    TransitionChild,
    TransitionRoot
} from '@headlessui/vue'
export default {
  components: { TransitionRoot, TransitionChild },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: false,
      default: 'Processing',
    },
    message: {
      type: String,
      required: false,
      default: null,
    },
  }
}
</script>