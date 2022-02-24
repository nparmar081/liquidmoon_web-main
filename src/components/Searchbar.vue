<template>
  <div>
    <div class="relative mt-1 rounded-md shadow-sm">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          class="h-4 w-4 text-gray-400"
          width="30px"
          height="31px"
          viewBox="0 0 30 31"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink">
          <g
            id="Page-1"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd">
            <g
              id="HOME"
              transform="translate(-472.000000, -312.000000)"
              fill="#555555"
              fill-rule="nonzero">
              <g id="Group-57" transform="translate(449.000000, 241.000000)">
                <g id="Group-6" transform="translate(0.000000, 56.750000)">
                  <g id="Group-7" transform="translate(23.000000, 15.000000)">
                    <path
                      d="M12.0759049,24.1391498 C14.7577601,24.1392148 17.3628998,23.2444396 19.478686,21.5964876 L27.4608639,29.5786655 C28.057164,30.1545515 29.0073304,30.1380382 29.5832164,29.5417381 C30.1449946,28.9600659 30.1449946,28.0379202 29.5832164,27.456313 L21.6010386,19.4741351 C25.6902973,14.2101548 24.7380505,6.62787243 19.4740701,2.5386137 C14.2100898,-1.55064502 6.62787243,-0.598398202 2.5386137,4.66558215 C-1.55064502,9.9295625 -0.598398202,17.5118448 4.66558215,21.6011036 C6.78481404,23.2474302 9.39229428,24.1405151 12.0759049,24.1391498 Z M5.66229792,5.65768199 C9.20447144,2.11544346 14.9474683,2.11537845 18.4897068,5.65755197 C22.0319454,9.19972549 22.0320104,14.9427223 18.4898368,18.4849609 C14.9476633,22.0271994 9.20466648,22.0272644 5.66242795,18.4850909 C5.66236294,18.4850259 5.66236294,18.4850259 5.66229792,18.4849609 C2.12012441,14.9685975 2.0992552,9.24653492 5.61561852,5.7043614 C5.63115665,5.68875825 5.64669478,5.67322012 5.66229792,5.65768199 Z"
                      id="Shape"></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
      <input
        type="text"
        name="search"
        id="search"
        class="block w-full rounded-full border-none bg-black py-3 pl-10 text-white"
        placeholder="Search Collections"
        v-model="filter.q" />
      <loading-indicator
        v-if="isLoading"
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3" />

      <ul
        v-if="isOpen"
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-secondary bg-black py-1 text-base shadow-lg ring-1 ring-secondary ring-opacity-5 focus:outline-none sm:text-sm"
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-3"
        tabindex="-1"
        v-click-away="closedPopup">
        <template v-if="collections.length > 0">
          <li
            v-for="collection in collections"
            :key="collection.collection.id"
            class="relative flex cursor-default select-none items-center text-lg text-gray-400 hover:bg-secondary hover:text-white"
            id="listbox-option-0"
            role="option">
            <router-link
              :to="`/collection/${collection.collection.id}`"
              class="flex w-full items-center py-2 px-3">
              <img
                :src="collection.collection.logoImage"
                class="mr-3 h-4 w-4" />
              {{ collection.collection.name }}
            </router-link>
          </li>
        </template>
        <li v-else class="p-2">No result</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getCollections } from "@/api/collections"

import _debounce from "lodash/debounce"

// const ITEMS_RESULT = 5

export default {
  data: () => ({
    isLoading: false,
    isOpen: false,
    isFetched: false,
    collections: [],

    filter: {
      pageNumber: 0,
      pageSize: 200,
      sort: "marketCap_asc",
      q: null,
    },

    debounceFetchCollection: null,
  }),
  created() {
    this.debounceFetchCollection = _debounce(this.fetchCollection, 1000)
  },
  watch: {
    "filter.q"(val) {
      if (val) {
        this.debounceFetchCollection()
      }
    },
  },
  methods: {
    // getCollectionsOnFocus() {
    //   if(!this.isFetched) {
    //     this.isLoading = true,
    //     getCollections({
    //       pageNumber: 0,
    //       pageSize: 200,
    //       sort: 'marketCap_asc',
    //       q: null,
    //     })
    //     .then((response) => {
    //       const { data } = response
    //       this.collections = data.list;
    //       this.isOpen = true;
    //       this.isFetched = true;
    //     })
    //     .finally(() => (this.isLoading = false))
    //   } else {
    //     this.isOpen = true;
    //   }
    // },
    closedPopup(e) {
      if (e.target.localName !== "input" && e.target.name !== "search") {
        this.isOpen = false
        this.isFetched = false
        this.filter.q = null
      }
    },
    fetchCollection() {
      this.isOpen = true
      this.collections = []
      this.isLoading = true
      getCollections(this.filter)
        .then((response) => {
          const { data } = response
          this.collections = data.list
          // this.collections = data.list.slice(0, ITEMS_RESULT)
        })
        .finally(() => (this.isLoading = false))
    },
  },
}
</script>

<style></style>
