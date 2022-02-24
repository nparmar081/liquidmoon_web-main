<template>
    <div class="text-center p-6">
        <slot name="icon"></slot>
        <h3 class="mt-2 text-sm font-medium text-white">{{ title }}</h3>
        <p class="mt-1 text-sm text-gray-500">
            <slot></slot>
        </p>
        <slot name="button"></slot>
    </div>
</template>

<script>
    export default {
        props: {
            icon: {
                type: Boolean,
                required: false,
                default: false,
            },
            title: {
                type: String,
                required: false,
                default: null,
            }
        },
    }
</script>