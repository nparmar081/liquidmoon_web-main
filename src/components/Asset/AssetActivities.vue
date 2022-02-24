<template>
  <accordian :default-open="false">
    <span class="flex items-center">
      <SwitchHorizontalIcon class="mr-3 w-5 h-5 text-primary" />
      Activities
    </span>
    <template #content>
      <div
        v-if="assetHistoryList.length > 0"
        class="flex flex-col text-white">
        <div class="overflow-x-auto -my-2 sm:-mx-6 lg:-mx-8">
          <div class="inline-block py-2 min-w-full align-middle sm:px-6 lg:px-8">
            <div class="overflow-hidden shadow">
              <table class="min-w-full divide-y divide-gray-600">
                <thead>
                  <tr class="text-left">
                    <th
                      scope="col"
                      class="py-3 px-6">
                      Transaction ID
                    </th>
                    <th
                      scope="col"
                      class="py-3 px-6">
                      Transaction Type
                    </th>
                    <th
                      scope="col"
                      class="py-3 px-6">
                      Source Type
                    </th>
                    <th
                      scope="col"
                      class="py-3 px-6">
                      Time
                    </th>
                    <th
                      scope="col"
                      class="py-3 px-6">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(activity, index) in assetHistoryList"
                    :key="index"
                    class="text-sm text-left">
                    <td class="py-4 px-6 whitespace-nowrap">
                      <span
                        v-if="activity.txAddress">{{ activity.txAddress.substring(0, 5) }}...{{ activity.txAddress.substring(activity.txAddress.length - 3) }}</span>
                      <span
                        v-if="activity.toWalletAddress">{{ activity.toWalletAddress.substring(0, 5) }}...{{ activity.toWalletAddress.substring(activity.toWalletAddress.length - 3) }}</span>
                    </td>
                    <td class="py-4 px-6 whitespace-nowrap">
                      {{ activity.eventType.label }}
                    </td>
                    <td class="py-4 px-6 whitespace-nowrap">
                      {{ activity.sourceType.label }}
                    </td>
                    <td class="py-4 px-6 whitespace-nowrap">
                      {{ timeDifference(activity.eventTimestamp) }}
                    </td>
                    <td class="py-4 px-6 whitespace-nowrap">
                      <!-- {{activity.price * activity.quantity / solanaPrice}} SOL -->
                      {{ totalAmount(activity) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <empty-state v-else>
        <template #icon>
          <clock-icon class="mx-auto w-12 h-12 text-gray-400" />
        </template>
        No activities
      </empty-state>
    </template>
  </accordian>
</template>

<script>
    // Shared Components
    import Accordian from "@/components/shared/Accordian";

    // Icons
    import {
        SwitchHorizontalIcon,
        ClockIcon,
    } from "@heroicons/vue/outline";

    // App
    export default {
        components: {
            Accordian,
            SwitchHorizontalIcon,
            ClockIcon
        },
        props: {
            nft: {
                type: Object,
                required: true
            }
        },
        data: () => ({
            nftData: null,
            assetHistoryList: [],
        }),
        mounted() {
            this.nftData = this.nft;
            if (this.nftData.assetHistoryList) {
                this.assetHistoryList = this.nftData.assetHistoryList.sort((a, b) => b.eventTimestamp - a
                    .eventTimestamp);
            }
        },
        methods: {
            // TODO: This should be a filter
            timeDifference(time) {
                let msPerMinute = 60 * 1000;
                let msPerHour = msPerMinute * 60;
                let msPerDay = msPerHour * 24;
                let msPerMonth = msPerDay * 30;
                let msPerYear = msPerDay * 365;

                var current = new Date().getTime();

                let elapsed = current - time;

                if (elapsed < msPerMinute) {
                    return Math.round(elapsed / 1000) + " seconds ago";
                } else if (elapsed < msPerHour) {
                    return Math.round(elapsed / msPerMinute) + " minutes ago";
                } else if (elapsed < msPerDay) {
                    return Math.round(elapsed / msPerHour) + " hours ago";
                } else if (elapsed < msPerMonth) {
                    return "approximately " + Math.round(elapsed / msPerDay) + " days ago";
                } else if (elapsed < msPerYear) {
                    return (
                        "approximately " + Math.round(elapsed / msPerMonth) + " months ago"
                    );
                } else {
                    return (
                        "approximately " + Math.round(elapsed / msPerYear) + " years ago"
                    );
                }
            },
            // TODO: Refactor this
            totalAmount(activity) {
                let t = (activity.price * activity.quantity) / 1000000000;
                return t.toFixed(2);
            },
        },
    }
</script>