<template>
  <div>
    <div
      v-if="receivedCollection.length > 0"
      class="rounded-md bg-gray-900 p-4">
      <div class="flex flex-col text-white">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="overflow-hidden shadow">
              <table class="min-w-full divide-y divide-gray-600">
                <thead>
                  <tr class="text-left">
                    <th scope="col" class="px-6 py-3">Item</th>
                    <th scope="col" class="px-6 py-3">Unit Price</th>
                    <th scope="col" class="px-6 py-3">Received</th>
                    <th scope="col" class="px-6 py-3">From</th>
                    <th scope="col" class="px-6 py-3">Status</th>
                    <th scope="col" class="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody
                  v-for="receivedCollections in receivedCollection"
                  :key="receivedCollections.assetListOfferId">
                  <tr class="text-left text-sm">
                    <td class="whitespace-nowrap px-6 py-4">
                      <tr>
                        {{
                          $filters.tokentrim(receivedCollections.chainTokenId)
                        }}
                      </tr>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <tr>
                        {{
                          $filters.sol(receivedCollections.price) + " SOL"
                        }}
                      </tr>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <tr>
                        {{
                          $filters.timerel(receivedCollections.createdOn)
                        }}
                      </tr>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <tr>
                        <a href="#" class="text-primary">
                          {{
                            $filters.tokentrim(
                              receivedCollections.offererUserWalletAddress
                            )
                          }}
                        </a>
                      </tr>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <tr>
                        {{
                          receivedCollections.listOfferStatus.label
                        }}
                      </tr>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <tr
                        v-if="
                          receivedCollections.listOfferStatus.label == 'Active'
                        ">
                        <l-button>Counter</l-button>
                        <l-button
                          @click="
                            acceptOffer(receivedCollections.assetListOfferId)
                          "
                          >Accept</l-button
                        >
                        <l-button
                          @click="
                            updateOfferList(
                              receivedCollections.assetListOfferId,
                              3
                            )
                          "
                          >Reject</l-button
                        >
                      </tr>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="col-span-4 flex justify-center">
      <empty-state>
        <template v-slot:icon>
          <inbox-icon class="mx-auto h-12 w-12 text-gray-400"></inbox-icon>
        </template>
        No offers received
      </empty-state>
    </div>
  </div>
</template>

<script>
import { InboxIcon } from "@heroicons/vue/outline"
import LButton from "../../components/shared/LButton.vue"
import {
  getAssetOfferReceived,
  putAssetOfferList,
} from "../../api/collections.js"
export default {
  components: { LButton, InboxIcon },
  data: () => ({
    receivedCollection: [],
    offererUser: [],
    allNFTs: [],
  }),
  mounted() {
    this.fetchReceivedCollection()
  },
  methods: {
    fetchReceivedCollection() {
      getAssetOfferReceived().then((response) => {
        this.receivedCollection = response.data
      })
    },
    async acceptOffer(assetOfferListId) {
      var me = this
      var receivedOffer = {}
      me.receivedCollection.forEach((offerReceive) => {
        if (offerReceive.assetListOfferId == assetOfferListId) {
          receivedOffer = offerReceive
        }
      })
      var result = await me.$store.dispatch("acceptOffer", {
        chainTokenId: receivedOffer.chainTokenId,
      })
      if (result.err) {
        this.emitter.emit("alert", {
          type: "error",
          title: "Transaction failed",
          message: result.err.message,
        })
      } else {
        this.emitter.emit("alert", {
          type: "success",
          message: "Successful transaction",
        })
        await me.updateOfferList(assetOfferListId, 1)
      }
    },
    async updateOfferList(assetOfferListId, status) {
      var me = this
      var receivedOffer = {}
      me.receivedCollection.forEach((offerReceive) => {
        if (offerReceive.assetListOfferId == assetOfferListId) {
          receivedOffer = offerReceive
        }
      })
      var payload = {
        assetId: receivedOffer.assetId,
        price: receivedOffer.price,
        listOfferStatus: status,
      }
      putAssetOfferList(assetOfferListId, payload).then((response) => {
        console.log(response)
      })
      this.$router.push({ name: "UserProfile" })
    },
  },
}
</script>
