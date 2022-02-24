<template>
  <TransitionRoot
    as="template"
    :show="open">
    <Dialog
      as="div"
      class="overflow-y-auto fixed inset-0 z-10"
      @close="close">
      <div class="flex justify-center items-end px-4 pt-4 pb-20 min-h-screen text-center sm:block sm:p-0">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
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
          <div
            class="inline-block overflow-hidden px-4 pt-5 pb-4 text-left align-bottom bg-brand-darker rounded-lg shadow-xl transition-all transform sm:p-6 sm:my-8 sm:w-full sm:max-w-sm sm:align-middle">
            <div>
              <div
                v-if="type == 'success'"
                class="flex justify-center items-center mx-auto w-12 h-12 bg-green-100 rounded-full">
                <CheckIcon
                  class="w-6 h-6 text-green-600"
                  aria-hidden="true" />
              </div>
              <div
                v-else-if="type == 'error'"
                class="flex justify-center items-center mx-auto w-12 h-12 bg-red-100 rounded-full">
                <BanIcon
                  class="w-6 h-6 text-red-600"
                  aria-hidden="true" />
              </div>
              <div
                v-else
                class="flex justify-center items-center mx-auto w-12 h-12 bg-blue-100 rounded-full">
                <InformationCircleIcon
                  class="w-6 h-6 text-blue-600"
                  aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <DialogTitle
                  v-if="title"
                  as="h3"
                  class="text-lg font-medium leading-6 text-white">
                  {{ title }}
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-white">
                    {{ message }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6">
              <button
                type="button"
                class="inline-flex justify-center py-2 px-4 w-full text-base font-medium text-white bg-accent-dark hover:bg-accent-darker rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-accent-dark focus:ring-offset-2 shadow-sm sm:text-sm"
                @click="close">
                {{ buttonText }}
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
    import {
        Dialog,
        DialogOverlay,
        DialogTitle,
        TransitionChild,
        TransitionRoot
    } from '@headlessui/vue'
    import {
        CheckIcon, BanIcon, InformationCircleIcon
    } from '@heroicons/vue/outline'

    export default {
        components: {
            Dialog,
            DialogOverlay,
            DialogTitle,
            TransitionChild,
            TransitionRoot,
            CheckIcon,
            BanIcon,
            InformationCircleIcon,
        },
        props: {
            open: {
                type: Boolean,
                required: true,
                default: false
            },
            type: {
                type: String,
                default: 'info'
            },
            title: {
                type: String,
                required: false,
                default: null
            },
            message: {
                type: String,
                default: null
            },
            buttonText: {
                type: String,
                default: 'OK'
            },
        },
        methods: {
            close() {
                this.$emit('alertClose')
            }
        },
    }
</script>