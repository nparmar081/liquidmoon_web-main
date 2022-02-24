<template>
  <div class="flex flex-col text-white font-mono">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-600">
          <table class="min-w-full divide-y divide-gray-600">
            <thead>
              <tr>
                <th scope="col" class="px-6 py-3 text-right text-xs">
                  #
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs">
                  Collection (Supply)
                </th>
                <th 
                  scope="col" 
                  class="px-6 py-3 text-right text-xs sortable-th" 
                  @click="sortBy('floorPrice')"
                  :class="sorting"
                >
                  Floor <img src="@/assets/icons/arrow-left.svg" />
                </th>
                <th 
                  scope="col" 
                  class="px-6 py-3 text-right text-xs sortable-th"
                  @click="sortBy('dailyAvgPrice')"
                  :class="sorting"
                >
                  Avg Price ({{ timeframeLabel }}) <img src="@/assets/icons/arrow-left.svg" />
                </th>
                <th 
                  scope="col" 
                  class="px-6 py-3 text-right text-xs sortable-th" 
                  @click="sortBy('dailyAvgPriceChange')"
                  :class="sorting"
                >
                  Change % ({{ timeframeLabel }}) <img src="@/assets/icons/arrow-left.svg" />
                </th>
                <th 
                  scope="col" 
                  class="px-6 py-3 text-right text-xs sortable-th" 
                  @click="sortBy('dailyVolume')"
                  :class="sorting"
                >
                  Volume ({{ timeframeLabel }}) <img src="@/assets/icons/arrow-left.svg" />
                </th>
                <th 
                  scope="col" 
                  class="px-6 py-3 text-right text-xs sortable-th" 
                  @click="sortBy('dailyVolumeChange')"
                  :class="sorting"
                >
                  Volume % ({{ timeframeLabel }}) <img src="@/assets/icons/arrow-left.svg" />
                </th>
                <th 
                  scope="col" 
                  class="px-6 py-3 text-right text-xs sortable-th" 
                  @click="sortBy('marketCap')"
                  :class="sorting"
                >
                  Market Cap <img src="@/assets/icons/arrow-left.svg" />
                </th>
                <th 
                  scope="col" 
                  class="px-6 py-3 text-right text-xs sortable-th" 
                  @click="sortBy('ownerCount')"
                  :class="sorting"
                >
                  Owners <img src="@/assets/icons/arrow-left.svg" />
                </th>
                <th 
                  scope="col" 
                  class="px-6 py-3 text-right text-xs sortable-th" 
                  @click="sortBy('listedCount')"
                  :class="sorting"
                >
                  Listed % <img src="@/assets/icons/arrow-left.svg" />
                </th>
                <th 
                  scope="col" 
                  class="px-6 py-3 text-right text-xs sortable-th"
                  @click="sortBy('twitterFollowers')"
                  :class="sorting"
                >
                  Twitter Followers <img src="@/assets/icons/arrow-left.svg" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(collection) in filteredCollections"
                :key="collection.id"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <button
                    :class="
                      collection.watched ? 'text-primary' : 'text-gray-600'
                    " 
                     @click="isWatched(collection.collection.id)"
                  >
                    <svg
                      width="23px"
                      height="12px"
                      viewBox="0 0 23 12"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                    >
                      <g
                        id="Page-1"
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <g
                          id="HOME"
                          transform="translate(-146.000000, -819.000000)"
                          fill="currentColor"
                          fill-rule="nonzero"
                        >
                          <g
                            id="eye"
                            transform="translate(145.999978, 819.000000)"
                          >
                            <path
                              d="M22.8282861,5.55533333 C22.6229932,5.32875556 17.6849561,0 11.5000225,0 C5.31508887,0 0.37709668,5.32875556 0.171758789,5.55533333 C-0.0572529297,5.80857778 -0.0572529297,6.19142222 0.171758789,6.44466667 C0.37709668,6.67124444 5.31517871,12 11.5000225,12 C17.6848662,12 22.6229482,6.67124444 22.8282861,6.44466667 C23.0572529,6.19142222 23.0572529,5.80857778 22.8282861,5.55533333 Z M11.5000225,10.6666667 C8.8994502,10.6666667 6.78322559,8.57293333 6.78322559,6 C6.78322559,3.42706667 8.8994502,1.33333333 11.5000225,1.33333333 C14.1005947,1.33333333 16.2168193,3.42706667 16.2168193,6 C16.2168193,8.57293333 14.1005947,10.6666667 11.5000225,10.6666667 Z"
                              id="Shape"
                            ></path>
                            <path
                              d="M12.1738506,4.66666667 C12.1738506,3.996 12.5103604,3.406 13.02229,3.04311111 C12.5629189,2.81044444 12.05054,2.66666667 11.5000225,2.66666667 C9.64236816,2.66666667 8.13088184,4.16208889 8.13088184,6 C8.13088184,7.83791111 9.64236816,9.33333333 11.5000225,9.33333333 C13.16321,9.33333333 14.5397959,8.13182222 14.8117529,6.56186667 C13.4548428,6.99408889 12.1738506,5.97875556 12.1738506,4.66666667 Z"
                              id="Path"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </button>
                  {{ collection.userWatched ? collection.userWatched  : 0}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <router-link
                    :to="`/collection/${collection.collection.id}`"
                    class="flex items-center space-x-4"
                  >
                    <img
                      :src="collection.collection.logoImage"
                      class="h-8 w-8 rounded-full"
                    />
                    <div class="max-w-sm truncate">
                      <p>{{ collection.collection.name }}</p>
                      <span class="text-gray-400">
                        {{ collection.collection.supply }}
                      </span>
                    </div>
                  </router-link>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end">
                    <span class="mr-3">
                      {{ numberShort($filters.crypto(collection.floorPrice)) }}
                    </span>
                    <img src="@/assets/solana-icon.png" class="h-4 w-4" />
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {{ numberShort($filters.crypto(collection.averagePrice)) }} SOL
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-right"
                  :class="
                    collection.dailyAvgPriceChange > 0
                      ? 'text-primary'
                      : 'text-red-500'
                  "
                >
                  <!-- {{ collection.changeAveragePrice * 100}}% -->
                  {{changePrice(collection)}}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {{numberShortener($filters.currency(collection.volume / 1000000000 * solanaPrice))}}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-right"
                  :class="
                    collection.changeVolume > 0
                      ? 'text-primary'
                      : 'text-red-500'
                  "
                >
                  {{ collection.changeVolume * 100 }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {{numberShortener($filters.currency(collection.marketCap / 1000000000 * solanaPrice))}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {{numberShort(collection.ownerCount)}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {{listed(collection.listedPercent) }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <div class="flex items-center justify-end">
                    {{ collection.collection.twitterFollowers}}
                    <img src="@/assets/twitter.svg" class="ml-3" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
 import {
    postUserCollectionWatched
  } from '../api/collections'
const shortNum = require('number-shortener');
export default {
  props: {
    collections: {
      type: Array,
      required: true,
    },
    isWeekly: {
      type: Boolean,
      required: false,
      default: false,
    },
    sorting: {
      type: String,
      required: true,
    },
    activeTab: {
      type: String
    }
  },
  data: () => ({
    filter: {
      itemPerPage: 20,
      page: 0,
      sort: 8,
    },
    hasWatched:null,
    collectionId:null,
    status:false,
  }),
  methods: {
    async isWatched(collectionId){
      if(!this.connectWallet) {
          this.emitter.emit('alert', { type: 'error', title: 'Wallet', message: 'Please connect a wallet'})
          return false;
      }
      var payload = {
          collection: {
            id: collectionId,
          },
          user:{
            id : ""
          },
          hasWatched:this.activeTab == 'my' ? 0 : 1,
        };
        await postUserCollectionWatched(payload)
      this.emitter.emit('alert', { type: 'success', title: 'watchlist', message: 'Data Submitted' })
    },
    changePrice(collection){
      if(collection.changeAveragePrice != 0){
        return (collection.changeAveragePrice * 100).toFixed(3)
      }else{
        return (collection.changeAveragePrice * 100) 
      }
    },
    listed(num){
      // return Math.floor(num) * 100
      let t=Math.floor(num * 100)
      return t
    },
    numberShortener(number) {
      return '$ ' + shortNum(number.split(',').join(''));
    },
    numberShortenerPercent(number) {
      return shortNum(number.split('.').join(''))
    },
    numberShort(number){
      return shortNum(number)
    },
    sortBy(name) {
      this.$emit('sort-by-event', name);
    },
  },
  computed: {
    connectWallet() {
      return this.$store.getters.isWalletConnected;
    },
    solanaPrice() {
      return this.$store.getters.solanaPrice
    },
    timeframeLabel() {
      return this.isWeekly ? '7d' : '24h'
    },
    filteredCollections() {
      return this.collections.map((collection) => {
        collection.averagePrice = this.isWeekly
          ? collection.weeklyAvgPrice
          : collection.dailyAvgPrice
        collection.changeAveragePrice = this.isWeekly
          ? collection.weeklyAvgPriceChange
          : collection.dailyAvgPriceChange
        collection.volume = this.isWeekly
          ? collection.weeklyVolume
          : collection.dailyVolume
        collection.changeVolume = this.isWeekly
          ? collection.weeklyVolumeChange
          : collection.dailyVolumeChange

        return collection
      })
    },
  },
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 2px;
  height: 5px;
  border-radius: 50%;
}

::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  background: transparent;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.sortable-th {
  position: relative;
  cursor: pointer;
}
.sortable-th img {
  display: none;
  transform: rotate(90deg);
  position: absolute;
  right: 0;
  top: 25px;
  width: 20px;
  height: 20px;
  transition: 0.3s ease-in-out;
}
.sortable-th.asc img {
  transform: rotate(-90deg);
}
.sortable-th.desc img {
  transform: rotate(90deg);
}
.sortable-th:hover img {
  display: block;
}
</style>
