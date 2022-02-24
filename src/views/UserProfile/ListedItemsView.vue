<template>
  <div>
    <div
      v-if="isLoading"
      class="flex col-span-4 justify-center items-center h-48">
      <LoadingIndicator />
    </div>
    <template v-else>
      <div
        v-if="listedItems.length > 0"
        class="grid grid-cols-4 gap-4 p-4 bg-gray-900 rounded-md">
        <div
          v-for="(collection, index) in listedItems"
          :key="collection.assetId">
          <collection-card
            :id="collection.assetId"
            :ranking="index + 1"
            :name="collection.name"
            :image="collection.imageUrl"
            :verified="collection.assetVerificationStatus.value == 1"
            :price="collection.price"
            :list-status="collection.listStatus.label"
            :mintaddress="collection.assetId"
            user-type="" />
          <BaseButton
            v-if="collection.listStatus.value == 0"
            type="outline"
            class="mt-2"
            @click="unlistNft(collection.assetId)">
            Unlist NFT
          </BaseButton>
        </div>

        <LoadingDialog
          :open="isProcessing"
          title="Processing" />
      </div>
      <div
        v-else
        class="flex col-span-4 justify-center">
        <empty-state>
          <template #icon>
            <collection-icon
              class="mx-auto w-12 h-12 text-gray-400" />
          </template>
          You have not listed any of your items
          <template #button>
            <div class="mt-6">
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
import { putUnlistAsset } from "@/api/collections.js"
import { CollectionIcon } from "@heroicons/vue/outline"
import CollectionCard from "@/components/CollectionCard.vue"
export default {
  components: {
    CollectionCard,
    CollectionIcon,
  },
  data: () => ({
    isProcessing: false,
  }),
  computed: {
    isLoading() {
      return !this.$store.getters.userListedItemsLoaded
    },
    listedItems() {
      return this.$store.state.user.listedItems
    },
  },
  methods: {
    refresh() {
      this.$store.dispatch("getAssetsOwned")
    },
    async unlistNft(assetOwnedId) {
      this.isProcessing = true
      var result = await this.$store.dispatch("unlistNft", {
        assetId: assetOwnedId,
      })
      if (result.err) {
        this.isProcessing = false
        this.emitter.emit("alert", {
          type: "error",
          title: "Transaction failed",
          message: result.err.message,
        })
      } else {
        var payload = {
          asset: {
            id: assetOwnedId,
          },
        }

        putUnlistAsset(payload).then((response) => {
          console.log(response)
        })

        this.isProcessing = false
        this.emitter.emit("alert", {
          type: "success",
          title: "Transaction completed"
        })
        this.$store.dispatch("getWalletItems")
        this.refresh()
      }
    },
  },
}
</script>
