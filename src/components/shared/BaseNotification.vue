<template>
    <div aria-live="assertive" class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
        <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
            <transition enter-active-class="transform ease-out duration-300 transition"
                enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
                leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="open"
                    class="max-w-sm w-full bg-brand-darker shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div class="p-4">
                        <div class="flex items-start">
                            <div class="flex-shrink-0" v-if="type == 'success'">
                                <CheckCircleIcon class="h-6 w-6 text-green-300" aria-hidden="true" />
                            </div>
                            <div class="flex-shrink-0" v-if="type == 'error'">
                                <ExclamationCircleIcon class="h-6 w-6 text-red-300" aria-hidden="true" />
                            </div>
                            <div class="ml-3 w-0 flex-1 pt-0.5">
                                <p v-if="title" class="text-md font-medium text-white mb-1">
                                    {{ title }}
                                </p>
                                <p class="text-sm text-white">
                                    {{ message }}
                                </p>
                            </div>
                            <div class="ml-4 flex-shrink-0 flex">
                                <button @click="close"
                                    class="bg-accent-darker hover:bg-accent-dark rounded-md inline-flex text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <span class="sr-only">Close</span>
                                    <XIcon class="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import _delay from 'lodash/delay'
    import {
        CheckCircleIcon, ExclamationCircleIcon
    } from '@heroicons/vue/outline'
    import {
        XIcon
    } from '@heroicons/vue/solid'

    export default {
        components: {
            CheckCircleIcon,
            ExclamationCircleIcon, 
            XIcon,
        },
        props: {
            open: {
                type: Boolean,
                required: true,
                default: false
            },
            type: {
                type: String,
                default: 'success'
            },
            title: {
                type: String,
                required: false,
                default: null
            },
            message: {
                type: String
            },
        },
        data() {
            return {
                timer: null
            }
        },
        watch: { 
            message: function(newValue) {
                if (newValue !== '') {
                    clearTimeout(this.timer)
                    let me = this
                    this.timer = _delay(function() {
                        me.$emit('notificationClose')
                        me.timer = null
                    }, 5000)
                }
            }
        },
        methods: {
            close() {
                clearTimeout(this.timer)
                this.timer = null
                this.$emit('notificationClose')
            }
        },
    }
</script>