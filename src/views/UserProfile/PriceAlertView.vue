<template>
  <div>
    <div
      v-if="priceAlertCollection.length > 0"
      class="flex flex-col text-white">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow">
            <table class="min-w-full divide-y divide-gray-600">
              <thead>
                <tr class="text-left">
                  <th scope="col" class="px-6 py-3">Item</th>
                  <th scope="col" class="px-6 py-3">Start Date</th>
                  <th scope="col" class="px-6 py-3">End Date</th>
                  <th scope="col" class="px-6 py-3">Condition</th>
                  <th scope="col" class="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody
                v-for="priceAlertCollections in priceAlertCollection"
                :key="priceAlertCollections.id">
                <tr class="text-left text-sm">
                  <td class="whitespace-nowrap px-6 py-4">
                    {{
                      $filters.tokentrim(
                        priceAlertCollections.asset.chainTokenId
                      )
                    }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ priceAlertCollections.createdOn }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ priceAlertCollections.expiredDate }}
                  </td>
                  <td
                    class="flex items-center gap-2 whitespace-nowrap px-6 py-4">
                    <ChevronUpIcon
                      v-if="
                        priceAlertCollections.priceType.label == 'Above Price'
                      "
                      class="h-5 w-5 text-primary"
                      aria-hidden="true" />
                    <ChevronDownIcon
                      v-else
                      class="h-5 w-5 text-red-600"
                      aria-hidden="true" />
                    <span v-if="priceAlertCollections.priceType.value">{{
                      priceAlertCollections.priceType.label
                    }}</span>
                    <span v-else>{{
                      priceAlertCollections.priceType.label
                    }}</span>
                    {{ $filters.crypto(priceAlertCollections.price) }} SOL
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ priceAlertCollections.status.label }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="col-span-4 flex justify-center">
      <empty-state>
        <template v-slot:icon>
          <SpeakerphoneIcon class="mx-auto h-12 w-12 text-gray-400" />
        </template>
        No alerts
      </empty-state>
    </div>
  </div>
</template>

<script>
import { SpeakerphoneIcon } from "@heroicons/vue/outline"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/solid"
import { getAssetPriceAlert } from "../../api/collections.js"
import moment from "moment"

export default {
  components: {
    ChevronDownIcon,
    ChevronUpIcon,
    SpeakerphoneIcon,
  },
  data: () => ({
    priceAlertCollection: [],
    user: [],
    alerts: [
      {
        condition: {
          isAbove: true,
        },
        status: "Active",
      },
      {
        condition: {
          isAbove: false,
        },
        status: "Active",
      },
    ],
  }),
  mounted() {
    this.fetchAssetPriceList()
  },
  methods: {
    fetchAssetPriceList() {
      getAssetPriceAlert().then((response) => {
        this.priceAlertCollection = response.data
        this.priceAlertCollection.forEach((offer) => {
          var startDate = new Date(offer.createdOn)
          offer.createdOn = moment(String(startDate)).format("DD MMMM YYYY")
          var endDate = new Date(offer.expiredDate)
          offer.expiredDate = moment(String(endDate)).format("DD MMMM YYYY")
        })
      })
    },
  },
}
</script>
