<template>
  <accordian
    :default-open="false"
    @on-show="getMoreFromThisCollection()">
    <span class="flex items-center">
      <PhotographIcon class="mr-3 w-5 h-5 text-primary" />
      More from this collection
    </span>
    <template #content>
      <loading-indicator
        v-if="isLoading"
        class="flex justify-center items-center h-52" />
      <div
        v-else
        class="flex overflow-x-scroll overflow-y-hidden gap-4 p-4 scrollbar-thin scrollbar-thumb-accent-light hover:scrollbar-thumb-accent-lighter scrollbar-track-gray-700">
        <collection-card
          v-for="(nft, index) in moreFromThisCollection"
          :id="nft.id"
          :key="index"
          class="transition-transform duration-500 ease-in-out hover:scale-105"
          :collection-id="nft.collection"
          :ranking="nft.extRankingsHowRare"
          :name="nft.name"
          :image="nft.imageUrl"
          :verified="true"
          :price="nft.price"
          :asset-details="true" />
      </div>
    </template>
  </accordian>
</template>

<script>
// Shared Components
import Accordian from "@/components/shared/Accordian";

// Components
import CollectionCard from "@/components/CollectionCard.vue";

// Icons
import {
    PhotographIcon,
} from "@heroicons/vue/outline";

// API
import { getNFTCollection } from '@/api/collections';

// App
export default {
    components: {
        Accordian,
        CollectionCard,
        PhotographIcon
    },
    data: () => ({
        moreFromThisCollection: [],
        isLoading: true,
    }),
    methods: {
        getMoreFromThisCollection() {
            this.isLoading = this.moreFromThisCollection.length == 0
            const params = {
                pageNumber: 0,
                pageSize: 20,
                sort: "listedPrice_asc"
            };
            const payload = {
                collectionId: this.$route.params.id
            }
            getNFTCollection(params, payload).then((response) => {
                const { data } = response;
                this.moreFromThisCollection = data.list;
                this.isLoading = false
            });
        },
    },
}
</script>
