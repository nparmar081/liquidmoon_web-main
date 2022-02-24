<template>
  <div>
    <div v-if="offerCollection.length > 0" class="rounded-md bg-gray-900 p-4">
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
                    <th scope="col" class="px-6 py-3">Time</th>
                    <th scope="col" class="px-6 py-3">Total Amount</th>
                    <th scope="col" class="px-6 py-3">Status</th>
                    <th scope="col" class="px-6 py-3">Action</th>
                  </tr>
                </thead>

                <tbody
                  v-for="offerCollections in offerCollection"
                  :key="offerCollections.assetListOfferId">
                  <tr class="text-left text-sm">
                    <td class="overflow-hidden whitespace-nowrap px-6 py-4">
                      <tr>
                        {{
                          $filters.tokentrim(offerCollections.chainTokenId)
                        }}
                      </tr>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <tr>
                        {{
                          $filters.sol(offerCollections.price) + " SOL"
                        }}
                      </tr>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ $filters.timerel(offerCollections.createdOn) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <tr>
                        {{
                          $filters.sol(offerCollections.price) + " SOL"
                        }}
                      </tr>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <tr>
                        {{
                          offerCollections.listOfferStatus.label
                        }}
                      </tr>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <tr
                        v-if="
                          offerCollections.listOfferStatus.label != 'Claimed'
                        ">
                        <td
                          v-if="
                            offerCollections.listOfferStatus.label == 'Active'
                          ">
                          <l-button
                            @click="
                              unlistOffer(offerCollections.assetListOfferId, 2)
                            "
                            >Cancel</l-button
                          >
                        </td>
                        <td
                          v-if="
                            offerCollections.listOfferStatus.label == 'Rejected'
                          ">
                          <l-button
                            @click="
                              unlistOffer(offerCollections.assetListOfferId, 4)
                            "
                            >Claim</l-button
                          >
                        </td>
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
        No offers made
      </empty-state>
    </div>
  </div>
</template>

<script>
import { InboxIcon } from "@heroicons/vue/outline"
import LButton from "../../components/shared/LButton.vue"
import { getAssetOfferMade, putAssetOfferList } from "../../api/collections.js"
export default {
  components: { LButton, InboxIcon },
  data: () => ({
    offerCollection: [],
    offererUser: [],
  }),
  mounted() {
    this.fetchOfferCollection()
  },
  methods: {
    fetchOfferCollection() {
      getAssetOfferMade().then((response) => {
        this.offerCollection = response.data
      })
    },
    async unlistOffer(assetOfferListId, status) {
      var me = this
      var madeOffer = {}
      me.offerCollection.forEach((offerMade) => {
        if (offerMade.assetListOfferId == assetOfferListId) {
          madeOffer = offerMade
        }
      })
      var result = await me.$store.dispatch("unlistOffer", {
        chainTokenId: madeOffer.chainTokenId,
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

        var payload = {
          assetId: madeOffer.assetId,
          price: madeOffer.price,
          listOfferStatus: status,
        }
        putAssetOfferList(assetOfferListId, payload).then((response) => {
          console.log(response)
        })
        this.$router.push({ name: "UserProfile" })
      }
    },
  },
}
</script>
