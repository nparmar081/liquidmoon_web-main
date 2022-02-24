<template>
    <accordian :defaultOpen="true">
        <span class="flex items-center">
            <IdentificationIcon class="h-5 w-5 mr-3 text-primary" />
            Detail
        </span>
        <template v-slot:content>
            <div class="grid gap-2">
                <div class="flex items-center justify-between">
                    <span>Mint Address</span>
                    <span class="text-gray-300">{{ nft?.mintId }}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span>Token Address</span>
                    <span class="text-gray-300">{{ nft?.sourceAddress }}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span>Owner</span>
                    <span class="text-gray-300">{{ nft?.owner }}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span>Artist Royalties</span>
                    <span class="text-gray-300"
                        v-if="nft?.collection.assetRoyalties">{{ nft?.collection.assetRoyalties }}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span>Transaction Fees</span>
                    <span class="text-gray-300">2%</span>
                </div>
                <div class="flex items-center justify-between">
                    <span>Listing/Bidding/Cancel</span>
                    <span class="text-gray-300">Free</span>
                </div>
            </div>
        </template>
    </accordian>
</template>

<script>
    // Shared Components
    import Accordian from "@/components/shared/Accordian";

    // Icons
    import {
        IdentificationIcon,
    } from "@heroicons/vue/outline";

    // App
    export default {
        components: {
            Accordian,
            IdentificationIcon
        },
        props: ['nft']
    }
</script>