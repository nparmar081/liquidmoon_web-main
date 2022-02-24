<template>
  <div>
    <div
      v-if="isLoading"
      class="flex col-span-4 justify-center items-center h-48">
      <LoadingIndicator />
    </div>
    <template v-else>
      <div
        v-if="$store.state.user.items.length > 0"
        class="grid grid-cols-4 gap-4 p-4 bg-gray-900 rounded-md">
        <div
          v-for="collection in $store.state.user.items"
          :key="collection.ranking">
          <collection-card
            :name="collection.name"
            :image="collection.image"
            :verified="collection.verified"
            :price="collection.price"
            :mintaddress="collection.mintaddress"
            user-type="seller" />
        </div>
      </div>
      <div
        v-else
        class="flex col-span-4 justify-center">
        <empty-state>
          <template #icon>
            <cube-icon class="mx-auto w-12 h-12 text-gray-400" />
          </template>
          Your do not have anything in your wallet
          <template #button>
            <div class="flex mt-6 space-x-2">
              <router-link
                to="/sell"
                class="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm">
                <PlusIcon
                  class="mr-2 -ml-1 w-5 h-5"
                  aria-hidden="true" />
                Create NFT
              </router-link>
              <button
                class="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
                @click="refresh">
                Refresh
              </button>
            </div>
          </template>
        </empty-state>
      </div>
    </template>
  </div>
</template>

<script>
import CollectionCard from "../../components/CollectionCard.vue"
import { PlusIcon } from "@heroicons/vue/solid"
import { CubeIcon } from "@heroicons/vue/outline"
export default {
  components: { CollectionCard, PlusIcon, CubeIcon },
  computed: {
    isLoading() {
      return !this.$store.getters.userItemsLoaded
    },
  },
  methods: {
    refresh() {
      this.$store.dispatch("getWalletItems")
    },
  },
}
</script>
