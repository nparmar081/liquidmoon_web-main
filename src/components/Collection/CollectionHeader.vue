<template>
  <section class="mx-auto max-w-3xl text-center">
    <img
      class="block object-cover relative z-10 mx-auto mt-12 mb-8 w-32 h-32 rounded-full border-2 border-black"
      :src="nft.image">
    <h1 class="mb-2 text-4xl">
      {{ nft.name }}
    </h1>
    <p class="mb-3 font-mono">
      {{ nft.description }}
    </p>

    <div class="flex mb-4 space-x-4">
      <div class="w-1/5">
        <collection-number title="listed items">
          {{ nft.listedItems }}/{{ nft.totalSupply }}
        </collection-number>
      </div>
      <div class="w-1/5">
        <collection-number title="total owners">
          {{ nft.ownerCount }}
        </collection-number>
      </div>
      <div class="w-1/5">
        <collection-number
          title="floor price"
          active>
          <div class="flex justify-center items-center">
            {{ $filters.crypto(nft.floorPrice) }}
            <img
              src="@/assets/solana-icon.png"
              class="ml-2">
          </div>
        </collection-number>
      </div>
      <div class="w-1/5">
        <collection-number title="avg. price">
          <div class="flex justify-center items-center">
            {{ $filters.crypto(nft.averagePrice) }}
            <img
              src="@/assets/solana-icon.png"
              class="ml-2">
          </div>
        </collection-number>
      </div>
      <div class="w-1/5">
        <collection-number title="volume traded">
          <div class="flex justify-center items-center">
            {{ $filters.crypto(nft.volumeTraded) }}
            <img
              src="@/assets/solana-icon.png"
              class="ml-2">
          </div>
        </collection-number>
      </div>
    </div>
  </section>
</template>

<script>
import CollectionNumber from '@/components/Collection/CollectionNumber'
export default {
  components: {
    CollectionNumber,
  },
  props: {
    nft: {
      type: Object,
      required: true,
    },
  },
}
</script>
