<template>
  <div class="container py-16">
    <div v-if="$store.getters.isWalletConnected">
      <section class="flex flex-col justify-center items-center mb-4">
        <img
          class="mb-4 w-36 h-36 rounded-full border border-white"
          src="https://avatars.dicebear.com/api/jdenticon/default.svg">
        <div class="mb-2">
          {{
            walletPublicKey
              ? $filters.tokentrim(walletPublicKey.toBase58())
              : ""
          }}
        </div>

        <l-button @click="editProfilePage">
          Edit Profile
        </l-button>
      </section>

      <div class="p-5 mb-4 w-48 text-sm bg-gray-800 rounded-md">
        <p class="text-gray-300 uppercase">
          total listed floor value
        </p>
        <span class="text-white">{{ totalListedSol }} SOL</span>
      </div>

      <div>
        <div class="sm:hidden">
          <label
            for="tabs"
            class="sr-only">Select a tab</label>
          <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
          <select
            id="tabs"
            name="tabs"
            class="block w-full bg-gray-800 rounded-md border-gray-900 focus:border-indigo-500 focus:ring-indigo-500">
            <option
              v-for="tab in tabs"
              :key="tab.name"
              :selected="tab.current">
              {{ tab.name }}
            </option>
          </select>
        </div>
        <div class="hidden mb-4 sm:block">
          <nav
            class="flex relative z-0 rounded-lg divide-x divide-gray-700 shadow"
            aria-label="Tabs">
            <a
              v-for="(tab, tabIdx) in tabs"
              :key="tab.name"
              :class="[
                activeTab === tab.name
                  ? 'text-primary'
                  : 'text-gray-300 hover:text-gray-400',
                tabIdx === 0 ? 'rounded-l-lg' : '',
                tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                'group relative min-w-0 flex-1 cursor-pointer overflow-hidden bg-gray-800 py-4 px-4 text-center text-sm font-medium hover:bg-gray-900 focus:z-10',
              ]"
              :aria-current="tab.current ? 'page' : undefined"
              @click.prevent="changeTab(tab.name)">
              <span>{{ tab.name }}</span>
              <span
                aria-hidden="true"
                :class="[
                  activeTab === tab.name ? 'bg-primary' : 'bg-transparent',
                  'absolute inset-x-0 bottom-0 h-0.5',
                ]" />
            </a>
          </nav>
        </div>

        <my-items-view v-if="activeTab === 'My Items'" />
        <listed-items-view
          v-else-if="activeTab === 'Listed Items'" />
        <offer-made-view
          v-else-if="activeTab === 'Offer Made'"
          :items="offerMadeItems" />
        <offer-received-view
          v-else-if="activeTab === 'Offer Received'"
          :items="offerReceivedsItems" />
        <activities-view
          v-else-if="activeTab === 'Activities'"
          :items="activities" />
        <price-alert-view
          v-else-if="activeTab === 'Price Alerts'" />
      </div>
    </div>
    <div v-else>
      <empty-state title="My Profile">
        <template #icon>
          <user-circle-icon
            class="mx-auto w-12 h-12 text-gray-400" />
        </template>
        Connect wallet to see your profile page.
      </empty-state>
    </div>
  </div>
</template>
<script>
import { UserCircleIcon } from "@heroicons/vue/outline"
import LButton from "../components/shared/LButton.vue"
import ActivitiesView from "./UserProfile/ActivitiesView.vue"
import ListedItemsView from "./UserProfile/ListedItemsView.vue"
import MyItemsView from "./UserProfile/MyItemsView.vue"
import OfferMadeView from "./UserProfile/OfferMadeView.vue"
import OfferReceivedView from "./UserProfile/OfferReceivedView.vue"
import PriceAlertView from "./UserProfile/PriceAlertView.vue"
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
export default {
  components: {
    UserCircleIcon,
    LButton,
    MyItemsView,
    ListedItemsView,
    OfferMadeView,
    OfferReceivedView,
    ActivitiesView,
    PriceAlertView,
  },
  data: () => ({
    activeTab: "My Items",
    tabs: [
      { name: "My Items" },
      { name: "Listed Items" },
      { name: "Offer Made" },
      { name: "Offer Received" },
      { name: "Activities" },
      { name: "Price Alerts" },
    ],
    offerMadeItems: [],
    offerReceivedsItems: [],
    activities: []
  }),
  computed: {
    walletPublicKey() {
      return this.$store.getters.walletPublicKey
    },
    listedItems() {
      return this.$store.state.user.listedItems
    },
    totalListedSol() {
      var totalSol = 0
      this.listedItems.forEach(items => {
        if(items.listStatus.value == 0) {
          totalSol += items.price / LAMPORTS_PER_SOL
        }
      });
      return totalSol
    }
  },
  methods: {
    changeTab(page) {
      this.activeTab = page
    },
    editProfilePage() {
      this.$router.push("/me/edit")
    },
  },
}
</script>
