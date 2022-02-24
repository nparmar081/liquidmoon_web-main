<template>
  <section class="w-full">
    <router-link
      :to="`/collection/${nftData.collection.id || nftData.collection}/asset/${nftData.id}`"
      class="block"
    >
      <div
        :style="{
          backgroundImage: `url(${nft.imageUrl})`,
        }"
        class="h-60 w-full bg-cover bg-center rounded-t-md"
      ></div>
      <div
        class="px-2 py-2 bg-gray-800 border-b border-black flex items-center justify-between"
      >
        <div>
          <p>{{nft.name.length>15 ? `${nft.name.substring(0, 10)}...` : nft.name }}</p>
          <span class="text-gray-600">{{ nft.sourceType.label }}</span>
        </div>
      </div>
      <div
        class="px-2 py-2 bg-gray-800 border-b border-black flex items-center justify-between"
        :class="!showRarity && 'rounded-b-md'"
      >
        <span
          class="rounded-full bg-green-400 text-black flex items-center space-x-2 p-2"
        >
          <img src="@/assets/solana-icon-black.png" class="h-6 w-6" />
          <span class="text-lg font-bold" v-if="nft.price!=0 " >
            {{$filters.sol(nft.price)}}
          </span>
          <span v-else >Null</span>
        </span>
        <div class="text-right">
          <p>Last</p>
          <span v-if="nft.lastSoldPrice!=0">
            {{$filters.sol(nft.lastSoldPrice)}}
          </span>
          <span v-else>Null</span>
        </div>
      </div>
      <div
        v-if="showRarity"
        class="px-4 py-2 bg-gray-800 rounded-b-md flex items-center space-x-4"
      >
        <div class="flex items-center space-x-2">
          <img src="@/assets/rarity-icon.png" class="h-4 w-4" />
          <span v-if="!nft.extRankingsHowRare"># Null</span>
          <span v-else># {{nft.extRankingsHowRare}}</span>
        </div>
        <div class="flex items-center space-x-2">
          <img src="@/assets/rarity-icon-2.png" class="h-4 w-4" />
          <span v-if="!nft.extRankingsMoonRank" ># Null</span>
          <span v-else># {{ nft.extRankingsMoonRank }}</span>
        </div>
      </div>
    </router-link>
  </section>
</template>

<script>
export default {
  props: {
    nftData: {
      type: Object,
      required: true,
    },
    showRarity: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    nft() {
      const nft = { ...this.nftData }
      nft.price = this.nftData.assetListList[0]?.price || 0

      const lastTransactionSold = this.nftData.assetHistoryList.find(
        (transaction) => transaction.eventType.value === 4,
      )

      nft.lastSoldPrice = lastTransactionSold ? lastTransactionSold.price : 0
      return nft
    },
  },
}
</script>

<style></style>
