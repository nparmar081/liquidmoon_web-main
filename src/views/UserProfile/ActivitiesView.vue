<template>
  <div>
    <div v-if="offerCollection.length > 0" class="rounded-md bg-gray-900 p-4">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow">
            <table class="min-w-full divide-y divide-gray-600">
              <thead>
                <tr class="text-left">
                  <th scope="col" class="px-6 py-3">Transaction ID</th>
                  <th scope="col" class="px-6 py-3">Transaction Type</th>
                  <th scope="col" class="px-6 py-3">Time</th>
                  <th scope="col" class="px-6 py-3">Total Amount</th>
                </tr>
              </thead>
              <tbody
                v-for="offerCollections in offerCollection"
                :key="offerCollections.id"
              >
                <tr class="text-left text-sm">
                  <td class="whitespace-nowrap px-6 py-4">
                    <span>
                      {{ $filters.tokentrim(offerCollections.txAddress) }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ offerCollections.eventType.desc }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ $filters.timerel(offerCollections.createdOn) }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ $filters.sol(offerCollections.price) + " SOL" }}
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
          <clock-icon class="mx-auto h-12 w-12 text-gray-400"></clock-icon>
        </template>
        No activities
      </empty-state>
    </div>
  </div>
</template>

<script>
import { ClockIcon } from "@heroicons/vue/outline";
import { getAssetActivities } from "../../api/collections.js";

export default {
  components: { ClockIcon },
  data: () => ({
    offerCollection: [],
  }),
  mounted() {
    this.fetchOfferCollection();
  },
  methods: {
    fetchOfferCollection() {
      getAssetActivities().then((response) => {
        this.offerCollection = response.data;
      });
    },
  },
};
</script>
