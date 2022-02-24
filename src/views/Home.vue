<template>
  <div>
    <banner />
    <div ref="home-collection" class="container py-4">
      <h2 class="mb-4 text-2xl">
        All collections over last
        <select v-model="timeframe" class="text-2xl text-white bg-transparent border-none focus:outline-none">
          <option v-for="t in timeframes" :key="t.value" class="bg-black" :value="t.value">
            {{ t.label }}
          </option>
        </select>
      </h2>

      <div class="flex justify-between items-center mb-4 font-mono">
        <div class="flex space-x-4">
          <l-button :active="activeTab == 'all'" @click.prevent="changeTab('all')">
            <img src="@/assets/icons/crystall-ball.png" class="mr-2 w-4 h-4" />
            Show All
          </l-button>

          <l-button :active="activeTab == 'my'" @click.prevent="changeTab('my')">
            <img src="@/assets/icons/eye.png" class="mr-2 w-4 h-4" />
            Your Watchlist
          </l-button>
        </div>

        <div class="flex space-x-4">
          <base-input v-model="filter.q" placeholder="Search for specific collection" class="w-96 text-sm">
            <template #icon>
              <img src="@/assets/icons/search.svg" class="w-4 h-4" />
            </template>
          </base-input>

          <base-select v-model="filter.pageSize" :options="itemPerPageOptions" />
        </div>
      </div>
      <loading-indicator v-if="isLoading" class="flex justify-center items-center h-64" />
      <collection-table
        v-else
        :collections="filteredCollections"
        :sorting="sorting"
        :sorting-name="sortingName"
        class="mb-2"
        :is-weekly="timeframe === 'weekly'"
        :activeTab="activeTab"
        @sort-by-event="sortBy" />
    </div>
    <div>
      <div
        class="bg-no-repeat bg-cover"
        :style="{
          backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.00) 9%, #000000 95%), url(${HeroImage})`,
        }">
        <div class="container">
          <nav class="flex justify-between items-center font-mono text-white sm:px-0">
            <div class="flex flex-1 -mt-px w-0">
              <a
                href="#"
                class="
                  inline-flex
                  items-center
                  pt-4
                  pr-1
                  text-sm
                  font-medium
                  hover:text-gray-700
                  border-t-2 border-transparent
                  hover:border-gray-300
                ">
                Showing {{ paginate.startIndex + 1 }}-{{ paginate.endIndex + 1 }}
                out of
                {{ paginate.totalItems }}
              </a>
            </div>

            <collection-table-pagination
              :current-page="pagination.currentPage"
              :total-pages="pagination.totalPages"
              @change-page="changePage" />

            <div class="flex flex-1 justify-end -mt-px w-0">
              <base-select v-model="filter.pageSize" :options="itemPerPageOptions" />
            </div>
          </nav>
          <featured-collection />
        </div>
        <home-footer />
      </div>
    </div>
  </div>
</template>

<script>
import Banner from "@/components/Banner.vue";
import CollectionTable from "../components/CollectionTable.vue";
import CollectionTablePagination from "../components/CollectionTablePagination.vue";
import FeaturedCollection from "../components/FeaturedCollection.vue";
import HomeFooter from "../components/HomeFooter.vue";
import LButton from "../components/shared/LButton.vue";

import HeroImage from "@/assets/footer-bg.png";
import BaseInput from "../components/shared/BaseInput.vue";
import BaseSelect from "../components/shared/BaseSelect.vue";

import { getCollections } from "@/api/collections";
import { itemPerPageOptions, timeframes } from "@/constants/filter";
import { paginate } from "@/lib/util";

import _debounce from "lodash/debounce";

export default {
  name: "Home",
  components: {
    Banner,
    LButton,
    CollectionTable,
    CollectionTablePagination,
    FeaturedCollection,
    HomeFooter,
    BaseInput,
    BaseSelect,
  },
  props: {
    isWatchlist: {
      type: Boolean,
      default: false
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    HeroImage,
    timeframes: timeframes,
    itemPerPageOptions: itemPerPageOptions,
    collections: [],
    timeframe: "daily",
    filter: {
      pageSize: 10,
      sort: "marketCap_desc",
      q: null,
    },
    isLoading: false,
    isFromFilter: false,
    pagination: {
      currentPage: 0,
      totalCollections: 0,
      totalPages: 0,
    },
    paginate: {
      startIndex: 1,
      endIndex: 5,
    },
    debounceFetchCollections: null,
    sorting: "",
    sortingName: "",
    activeTab: "all",
  }),
  computed: {
    filteredCollections() {
      return this.collections;
    },
    connectWallet() {
      return this.$store.getters.isWalletConnected;
    },
  },
  watch: {
    sorting(val) {
      if (val === "asc") {
        this.collections = this.collections.sort((a, b) => a[this.sortingName] - b[this.sortingName]);
      } else {
        this.collections = this.collections.sort((a, b) => b[this.sortingName] - a[this.sortingName]);
      }
    },
    timeframe() {
      this.filter.sort = this.timeframe === "daily" ? "dailyVolume_asc" : "weeklyVolume_desc";
    },
    filter: {
      handler() {
        this.pagination.currentPage = 0;
        this.isFromFilter = true;
        this.debounceFetchCollections();
      },
      deep: true,
    },
  },
  created() {
    this.debounceFetchCollections = _debounce(this.fetchCollections, 1000);
  },
  mounted() {
    this.fetchCollections();
  },
  methods: {
    changeTab(tabName) {
      if(!this.connectWallet && tabName == 'my') {
        this.emitter.emit('alert', { type: 'error', title: 'Wallet', message: 'Please connect a wallet'})
        return false;
      }
      if(this.isWatchlist && tabName == 'all') {
         this.$router.push({ name: "Home" });
      } else {
        this.activeTab = tabName;
        this.fetchCollections();
      }
    },
    sortBy(name) {
      if (!this.sorting) {
        this.sorting = "asc";
      } else {
        if (this.sorting === "asc") {
          this.sorting = "desc";
        } else {
          this.sorting = "asc";
        }
      }
      this.sortingName = name;
      this.filter.sort = this.sortingName + "_" + this.sorting;
    },
    scrollToTop() {
      const element = this.$refs["home-collection"];
      const top = element.offsetTop;

      window.scrollTo(0, top);
    },
    changePage(page) {
      this.pagination.currentPage = page;
      this.fetchCollections();
    },
    fetchCollections() {
      if(this.$route.name == 'Watchlist') {
        this.activeTab = this.isWatchlist ? 'my' : 'all'
        if(!this.connectWallet) {
        this.emitter.emit('alert', { type: 'error', title: 'Wallet', message: 'Please connect a wallet'})
        return false;
      }
      }
      this.isLoading = true;
      // this.pagination.currentPage = 0

      const payload = {
        ...this.filter,
        pageNumber: this.pagination.currentPage,
      };

      if (!this.filter.q) delete payload.q;
      if (this.activeTab == "my") {
        payload["hasWatched"] = true;
      }
      return getCollections(payload)
        .then((response) => {
          const { data } = response;
          this.pagination.totalCollections = data.totalCount;
          this.pagination.currentPage = data.currPage;
          this.pagination.totalPages = data.totalPage;
          if (!this.sorting) {
            this.collections = data.list;
          } else {
            if (this.sorting === "asc") {
              this.collections = data.list.sort((a, b) => a[this.sortingName] - b[this.sortingName]);
            } else {
              this.collections = data.list.sort((a, b) => b[this.sortingName] - a[this.sortingName]);
            }
          }

          this.paginate = paginate(data.totalCount, data.currPage + 1, this.filter.pageSize, data.totalPage);
        })
        .finally(() => {
          this.isLoading = false;
          if (this.isFromFilter) this.scrollToTop();

          this.isFromFilter = false;
        });
    },
  },
};
</script>
