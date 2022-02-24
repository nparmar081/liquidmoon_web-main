<template>
    <accordian :defaultOpen="true">
        <span class="flex items-center">
            <ColorSwatchIcon class="h-5 w-5 mr-3 text-primary" />
            Attributes
        </span>
        <template v-slot:content>
            <div class="grid grid-cols-3 gap-4" v-if="nft.assetTraitList.length">
                <div v-for="(attribute, index) in nft?.assetTraitList" :key="index"
                    class="bg-gray-700 text-sm p-4 rounded-md">
                    <p class="text-gray-300 uppercase">
                        {{ attribute.traitType }}
                    </p>
                    <span class="text-white">{{ attribute.value }}</span>
                </div>
            </div>
            <div v-else>
              <p>No Attributes</p>
            </div>
        </template>
    </accordian>
</template>

<script>
    // Shared Components
    import Accordian from "@/components/shared/Accordian";

    // Icons
    import {
        ColorSwatchIcon,
    } from "@heroicons/vue/outline";

    // App
    export default {
        components: {
            Accordian,
            ColorSwatchIcon
        },
        props: ['nft']
    }
</script>