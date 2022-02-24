<template>
    <accordian :defaultOpen="false">
        <span class="flex items-center">
            <UserIcon class="h-5 w-5 mr-3 text-primary" />
            About {{ nft?.name }}
        </span>
        <template v-slot:content>
            <p>
                {{ nft?.collection.description }}
            </p>
        </template>
    </accordian>
</template>

<script>
    // Shared Components
    import Accordian from "@/components/shared/Accordian";

    // Icons
    import {
        UserIcon,
    } from "@heroicons/vue/outline";

    // App
    export default {
        components: {
            Accordian,
            UserIcon
        },
        props: ['nft']
    }
</script>