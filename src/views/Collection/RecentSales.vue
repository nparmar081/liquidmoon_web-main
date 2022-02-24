<template>
  <div class="flex flex-col text-white font-mono">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <loading-indicator v-if="isLoading" class="h-64 flex items-center justify-center" />
        <div v-else class="shadow overflow-hidden border-b border-gray-600">
          <table class="min-w-full divide-y divide-gray-600">
            <thead>
              <tr class="text-left text-xs">
                <th scope="col" class="px-6 py-3">
                  Name
                </th>
                <th scope="col" class="px-6 py-3">
                  Transaction ID
                </th>
                <th scope="col" class="px-6 py-3">
                  Transaction Type
                </th>
                <th scope="col" class="px-6 py-3">
                  Time
                </th>
                <th scope="col" class="px-6 py-3">
                  Total Amount
                </th>
                <th scope="col" class="px-6 py-3">
                  Mint Address
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in recentSales" :key="sale.id" class="text-left text-sm">
                <td class="px-6 py-4 whitespace-nowrap">
                  {{sale.assetName}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span>{{ $filters.tokentrim(sale.assetHistory.txAddress) }} </span>
                </td>
                <td class="px-6 py-4">
                  {{ sale.assetHistory.eventType.desc }}
                </td>
                <td class="px-6 py-4">
                  {{ $filters.timerel(sale.assetHistory.createdOn) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ $filters.crypto(sale.assetHistory.price) + " SOL" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span>{{ $filters.tokentrim(sale.assetHistory.toWalletAddress) }} </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getCollectionRecentSale
  } from '../../api/collections'
  export default {
    data: () => ({
      isLoading: true,
      recentSales: []
    }),
    mounted() {
      this.getRecentSale();
    },
    methods: {
      getRecentSale() {
        const params = {
          pageNumber: 0,
          pageSize: 20,
          collectionId: this.$route.params.id,
        };
        getCollectionRecentSale(params).then((response) => {
          this.isLoading = false
          const {
            data
          } = response;
          this.recentSales = data.list;
        });
      }
    },
  }
</script>