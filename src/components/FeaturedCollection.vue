<template>
  <div class="py-8">
    <div class="flex items-center justify-between">
      <h2 class="mb-4 text-lg">
        Most viewed collections over last
        <select
          v-model="timeframe"
          class="text-purple border-none focus:outline-none bg-transparent"
        >
          <option
            v-for="timeframe in timeframes"
            :key="timeframe.value"
            :value="timeframe.value"
          >
            {{ timeframe.label }}
          </option>
        </select>
      </h2>
      <span class="text-sm font-mono">
        Based on total unique views on Liquid Moon
      </span>
    </div>

    <loading-indicator v-if="isLoading" class="h-64 flex items-center justify-center" />
    <!-- <carousel-3d :disable3d="true" v-else>
      <slide
        v-for="(collection, index) in featuredCollection"
        :key="index"
        :index="index"
      >
        <collection-card
          :ranking="index + 1"
          :name="collection.collection.name"
          :image="collection.collection.featuredImage"
          :verified="collection.collection.isVerified"
        ></collection-card>
        Slide 1 Content
      </slide>
    </carousel-3d> -->
    <div v-else class="collection-cards flex space-x-4 overflow-x-scroll scrollbar-thin scrollbar-thumb-accent-light hover:scrollbar-thumb-accent-lighter scrollbar-track-gray-700">
      <collection-card
        v-for="(collection, index) in featuredCollection"
        :key="collection.id"
        :ranking="index + 1"
        :id="collection.collectionId + 1"
        :name="collection.name"
        :image="collection.logoImage"
        :verified="collection.verificationStatus"
        :isViewedCollection=true
        :collectionId=collection.collectionId
      ></collection-card>
    </div>
  </div>
</template>

<script>
import { getFeaturedCollection } from '../api/collections'
import CollectionCard from './CollectionCard.vue'
import { timeframes } from '@/constants/filter'

// import { Carousel3d, Slide } from 'vue-carousel-3d'

export default {
  components: { CollectionCard },
  data: () => ({
    timeframes: timeframes,
    timeframe: '',
    featuredCollection: [],
    isLoading: true,
  }),
  mounted() {
    this.fetchFeaturedCollection()
  },
  watch: {
    timeframe() {
      this.fetchFeaturedCollection()
    },
  },
  methods: {
    fetchFeaturedCollection() {
      this.isLoading = true
      const params = {
          timeRangeInHours: this.timeframe,
        };
      getFeaturedCollection(params)
        .then((response) => {
          this.featuredCollection = response.data
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
  created(){
    
  }
}
</script>

<style scoped></style>
