<template>
  <section class="py-2 px-4 font-mono text-xs tracking-tighter text-accent-lightest bg-secondary">
    <div class="container">
      <div class="flex flex-wrap justify-center items-center space-x-6">
        <div>
          Solana NFT Marketplaces:
          <span
            v-for="statistics in statistic.marketplaceCount"
            :key="statistics.marketplaceCount"
            class="text-accent-lighter">{{ statistic.marketplaceCount.marketplaceCount }}</span>
        </div>
        <div>
          Total Market Cap:
          <span
            v-for="statistics in statistic.totalMarketCapAndVolume"
            :key="statistics.totalMarketCap"
            class="text-accent-lighter">
            {{
              numberShortener(
                $filters.currency(
                  (statistics.totalMarketCap / 1000000000) * solanaPrice
                )
              )
            }}
          </span>
        </div>
        <div>
          24h Vol:
          <span
            v-for="statistics in statistic.totalMarketCapAndVolume"
            :key="statistics.dailyTotalVolume"
            class="text-accent-lighter">
            {{
              numberShortener(
                $filters.currency(
                  (statistics.dailyTotalVolume / 1000000000) * solanaPrice
                )
              )
            }}
          </span>
        </div>
        <div>
          1 SOL = ${{ solanaPrice }}
          <span
            :class="solana24hChange > 0 ? 'text-accent-lighter' : 'text-red-600'">
            <span v-if="solana24hChange > 0">+</span>
            {{ solana24hChange }}%
          </span>
        </div>
        <div>
          Dominance:
          <span
            v-for="(statistics, index) in statistic.dominanceList"
            :key="statistics.dominanceList"
            class="text-accent-lighter">
            <span v-if="index == 0">
              {{ statistics.collectionName }} :
              {{ statistics.dailyVolumeChange.toFixed(2) }} % /
            </span>
            <span v-else>
              {{ statistics.collectionName }} :
              {{ statistics.dailyVolumeChange.toFixed(2) }} %
            </span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const shortNum = require("number-shortener")
import { getMarketPlaceDetails } from "../api/collections.js"
export default {
  data: () => ({
    exchangeRateCheckInterval: null,
    statistic: [],
    dominanceList: [],
    marketplaceCount: [],
    totalMarketCapAndVolume: [],
  }),
  computed: {
    solanaPrice() {
      return this.$store.getters.solanaPrice
    },
    solana24hChange() {
      return this.$store.getters.solana24hChange
    },
  },
  watch: {
    solanaPrice(newVal) {
      clearInterval(this.exchangeRateCheckInterval)
      if (newVal !== null) {
        this.exchangeRateCheckInterval = setInterval(() => {
          this.$store.dispatch("fetchExchangeRate")
        }, 60000)
      }
    },
  },
  mounted() {
    this.fetchOfferCollection()
  },
  methods: {
    fetchOfferCollection() {
      getMarketPlaceDetails().then((response) => {
        this.statistic = response.data
      }),
        setInterval(() => {
          getMarketPlaceDetails().then((response) => {
            this.statistic = response.data
          })
        }, 300000)
    },
    numberShortener(number) {
      return "$ " + shortNum(number.split(",").join(""))
    },
  },
}
</script>
