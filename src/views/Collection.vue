<template>
  <div>
    <collection-meta :nft="nftMeta" />
    <collection-header :nft="nftSummary" />
    <div class="flex mx-auto max-w-md">
      <div class="w-1/3">
        <div
          class="flex justify-center items-center py-2 cursor-pointer"
          :class="
            page === 'listing'
              ? 'border-b-2 border-primary text-white'
              : 'text-gray-500'
          "
          @click="changeTab('listing')">
          <base-icon
            name="listing"
            class="mr-3 w-5 h-5 text-primary" />
          <span>Listing</span>
        </div>
      </div>
      <div class="w-1/3">
        <div
          class="flex justify-center items-center py-2 cursor-pointer"
          :class="
            page === 'recent-sales'
              ? 'border-b-2 border-primary text-white'
              : 'text-gray-500'
          "
          @click="changeTab('recent-sales')">
          <base-icon
            name="sales"
            class="mr-3 w-5 h-5 text-primary" />
          <span>Recent Sales</span>
        </div>
      </div>
    </div>
    <div class="flex">
      <!-- Sidebar -->
      <div
        class="bg-gray-800"
        :class="showSidebar ? 'w-80' : 'w-12'">
        <collection-sidebar
          v-if="showSidebar"
          :collection-id="collectionId"
          :filter="filter"
          :show-sidebar="showSidebar"
          @toggle-sidebar="toggleSidebar"
          @update-price-filter="updatePriceFilter"
          @update-marketplace-filter="updateMarketplaceFilter"
          @update-attributes-filter="updateAttributesFilter" />
        <img
          v-else
          src="@/assets/icons/arrow-left.svg"
          class="my-3 mx-auto w-5 h-5 rotate-180 cursor-pointer"
          @click="toggleSidebar">
      </div>
      <div class="grow p-4 border-t border-secondary">
        <!-- Listing -->
        <template v-if="page === 'listing'">
          <div class="flex sticky top-0 justify-between items-center bg-black">
            <div class="flex items-center space-x-2">
              <!-- Search -->
              <base-input
                v-model="searchKeyword"
                placeholder="Search Items"
                class="w-56">
                <template #icon>
                  <img
                    src="@/assets/icons/search.svg"
                    class="w-4 h-4">
                </template>
              </base-input>
              <!-- Rarity -->
              <div
                class="inline-flex justify-center items-center p-2 whitespace-nowrap rounded-lg border border-secondary">
                <base-checkbox
                  v-model="showRarity"
                  name="rarity"
                  value="show">
                  Show rarity rank
                </base-checkbox>
              </div>
              <!-- Sort -->
              <base-select
                v-model="sort"
                :options="sortFilters"
                class="w-56" />
            </div>
            <div class="flex items-center space-x-2">
              <!-- Grid -->
              <div class="flex">
                <button
                  class="p-3 rounded-l-md border border-gray-700"
                  @click="toggleGrid">
                  <base-icon
                    class="w-4 h-4"
                    name="grid-4"
                    :class="is4grid && 'text-primary'" />
                </button>
                <button
                  class="p-3 rounded-r-md border border-l-0 border-gray-700"
                  @click="toggleGrid">
                  <base-icon
                    class="w-4 h-4"
                    name="grid-9"
                    :class="!is4grid && 'text-primary'" />
                </button>
              </div>
              <!-- Refresh -->
              <button
                class="p-3 rounded-md border border-gray-700"
                @click.prevent="fetchCollection">
                <img
                  src="@/assets/icons/refresh.svg"
                  class="w-4 h-4">
              </button>
            </div>
          </div>
          <loading-indicator
            v-if="isAssetsLoading"
            class="flex justify-center items-center h-64" />
          <div v-else>
            <template v-if="collection.length > 0">
              <div
                class="grid gap-4 py-4"
                :class="gridSystem">
                <nft-card
                  v-for="(nft, index) in collection"
                  :key="nft.id + index"
                  :nft-data="nft"
                  :show-rarity="isRarityChecked"
                  class="mb-4" />
              </div>
              <collection-table-pagination
                :total-pages="pagination.totalPages"
                :current-page="pageNumber"
                class="flex justify-center"
                @change-page="changePage" />
            </template>
            <div
              v-else
              class="py-8 text-center">
              No results found
            </div>
          </div>
        </template>
        <!-- Recent sales -->
        <recent-sales v-else-if="page === 'recent-sales'" />
        <price-chart v-else />
      </div>
    </div>
  </div>
</template>

<script>
import CollectionHeader from '../components/Collection/CollectionHeader.vue'
// import CollectionMeta from '../components/Collection/CollectionMeta.vue'
import CollectionSidebar from '../components/Collection/CollectionSidebar.vue'
import NftCard from '../components/Collection/NftCard.vue'
import BaseInput from '../components/shared/BaseInput.vue'
import BaseSelect from '../components/shared/BaseSelect.vue'
import BaseCheckbox from '../components/shared/BaseCheckbox.vue'

import {
  getCollection,
  getNFTCollection,
  getCollectionSortFilter,
} from '@/api/collections'

import _debounce from 'lodash/debounce'
import CollectionTablePagination from '../components/CollectionTablePagination.vue'
import BaseIcon from '../components/shared/BaseIcon.vue'
import RecentSales from './Collection/RecentSales.vue'
import PriceChart from './Collection/PriceChart.vue'

export default {
  components: {
    BaseInput,
    // CollectionMeta,
    CollectionHeader,
    CollectionSidebar,
    BaseSelect,
    NftCard,
    BaseCheckbox,
    CollectionTablePagination,
    BaseIcon,
    RecentSales,
    PriceChart,
  },
  data: () => ({
    page: 'listing', // listing, recent-sales, price-chart

    collection: {},
    sortFilters: [],

    isCollectionLoading: false,
    isAssetsLoading: false,

    nftSummary: {
      name: null,
      image: null,
      description: null,
      floorPrice: 0,
      listedItems: 0,
      totalSupply: 0,
      averagePrice: 0,
      volumeTraded: 0,
      ownerCount: 0,
    },
    nftMeta: {
      isVerified: false,
      blueChipType: null,

      discord: null,
      twitter: null,
      website: null,
    },
    filter: {
      sourceTypes: [],
      minPrice: null,
      maxPrice: null,
      attributes: [],
    },
    pageNumber: 0,
    sort: 'listedPrice_asc',
    pagination: {
      totalCollections: 0,
      totalPages: 0,
    },
    searchKeyword: null,
    showRarity: ['show'],

    debounceFetchAssets: null,

    is4grid: false,
    showSidebar: true,
  }),
  computed: {
    gridSystem() {
      if(this.is4grid) {
        if(this.showSidebar) {
          return 'grid-cols-4' 
        } else {
          return 'grid-cols-5'
        }
      } else {
        if(this.showSidebar) {
          return 'grid-cols-6' 
        } else {
          return 'grid-cols-7'
        }
      }
    },
    params() {
      return {
        pageNumber: this.pageNumber,
        pageSize: this.is4grid ? 20 : 42,
        sort: this.sort,
      }
    },
    isRarityChecked() {
      return this.showRarity.includes('show')
    },
    collectionId() {
      return this.$route.params.id
    },
  },
  watch: {
    searchKeyword() {
      this.debounceFetchAssets()
    },
    params: {
      deep: true,
      handler() {
        this.fetchAssets()
      },
    },
    filter: {
      deep: true,
      handler() {
        this.fetchAssets()
      },
    },
  },
  created() {
    this.debounceFetchAssets = _debounce(this.fetchAssets, 500)
  },
  mounted() {
    getCollectionSortFilter().then((response) => {
      const { data } = response
      this.sortFilters = data
    })
    this.fetchCollection()
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    changeTab(page) {
      this.page = page
    },
    updatePriceFilter(filter) {
      this.filter.minPrice = filter.minPrice
      this.filter.maxPrice = filter.maxPrice
    },
    updateMarketplaceFilter(marketplaces) {
      this.filter.sourceTypes = [...marketplaces]
    },
    updateAttributesFilter(attributes) {
      let attributesPayload = []

      attributes.forEach((attribute) => {
        attribute.selected.forEach((selected) => {
          attributesPayload.push(`${attribute.traitType || ''}|${selected}`)
        })
      })

      this.filter.attributes = attributesPayload
    },
    fetchCollection() {
      getCollection(this.collectionId).then((res) => {
        const { data } = res
        const { collectionSummary } = data
        this.nftSummary.name = data.name
        this.nftSummary.description = data.description
        this.nftSummary.image = data.logoImage
        this.nftSummary.floorPrice = collectionSummary?.floorPrice || 0
        this.nftSummary.listedItems = collectionSummary?.listedCount || 0
        this.nftSummary.totalSupply = data.supply || 0
        this.nftSummary.volumeTraded = collectionSummary?.totalVolume || 0
        this.nftSummary.ownerCount = collectionSummary?.ownerCount || 0

        if (collectionSummary != null) {
          if (collectionSummary.totalSales > 0) {
            this.nftSummary.averagePrice = collectionSummary.totalVolume / collectionSummary.totalSales
          }
        }

        this.nftMeta.isVerified = data.isVerified
        this.nftMeta.blueChipType = data.blueChipType.label
        this.nftMeta.discord = data.connectDiscord
        this.nftMeta.twitter = data.connectTwitter
        this.nftMeta.website = data.connectWebsite

        return this.fetchAssets()
      })
    },
    changePage(page) {
      this.pageNumber = page
      this.fetchAssets()
    },
    fetchAssets() {
      const payload = {
        ...this.filter,
        collectionId: this.collectionId,
        q: this.searchKeyword,
      }
      payload.minPrice = payload.minPrice * 1000000000 || null
      payload.maxPrice = payload.maxPrice * 1000000000 || null

      if (!payload.q) delete payload.q
      this.isAssetsLoading = true
      return getNFTCollection(this.params, payload)
        .then((response) => {
          const { data } = response
          this.collection = data.list

          this.pagination.totalCollections = data.totalCount
          this.pagination.totalPages = data.totalPage

          this.pageNumber = data.currPage
        })
        .finally(() => (this.isAssetsLoading = false))
    },
    toggleGrid() {
      this.is4grid = !this.is4grid
    },
  },
}
</script>
