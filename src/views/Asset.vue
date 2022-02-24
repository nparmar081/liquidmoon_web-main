<template>
  <div class="container py-16">
    <div v-if="nft">
      <div class="grid grid-cols-2 gap-6">
        <div class="col-span-1">
          <div
            class="w-full h-96 bg-center bg-no-repeat bg-contain"
            :style="{ backgroundImage: 'url(' + nft?.imageUrl + ')' }" />
          <accordian
            class="mb-2"
            :default-open="true">
            <span class="flex items-center">
              <ChartBarIcon class="mr-3 w-5 h-5 text-primary" />
              Price history
            </span>
            <template #content>
              <div class="h-72">
                <vue3-chart-js
                  id="price-history"
                  type="line"
                  :data="priceHistory"
                  :options="chartOptions" />
              </div>
            </template>
          </accordian>
        </div>
        <div class="col-span-1">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h1 class="text-3xl font-bold">
                {{ nft?.name }}
              </h1>
              <router-link
                :to="`/collection/${nft?.collection.id}`"
                class="mb-4 text-xl text-primary">
                {{ nft?.collection.name }}
              </router-link>
            </div>
            <div class="space-y-2 text-primary">
              <div class="flex justify-end">
                <button
                  :disabled="userType === 'seller'"
                  @click.prevent="togglePriceAlertModal(true)">
                  <BellIcon class="w-8 h-8" />
                </button>
              </div>
              <div class="flex items-center space-x-5">
                <div
                  class="flex relative items-center cursor-pointer"
                  @click="showDropdown">
                  <share-icon class="w-6 h-6" />
                  <span class="ml-1">Share</span>
                  <div
                    v-if="showShareDropdown"
                    v-click-away="closeShareDropdown"
                    class="absolute top-8 right-0 p-2 space-y-2 text-accent-light bg-black rounded-md border border-gray-500 shadow-md">
                    <div
                      class="flex hover:text-accent-lighter whitespace-nowrap cursor-pointer"
                      @click="copyURL">
                      <ClipboardCopyIcon class="w-6 h-6" />
                      <span class="ml-2">Copy to Clipboard</span>
                    </div>
                    <div class="flex hover:text-accent-lighter whitespace-nowrap cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="rounded-full"
                        fill="currentColor"
                        viewBox="0 0 30 30"
                        width="24px"
                        height="24px">
                        <path d="M15,3C8.373,3,3,8.373,3,15c0,6.016,4.432,10.984,10.206,11.852V18.18h-2.969v-3.154h2.969v-2.099c0-3.475,1.693-5,4.581-5 c1.383,0,2.115,0.103,2.461,0.149v2.753h-1.97c-1.226,0-1.654,1.163-1.654,2.473v1.724h3.593L19.73,18.18h-3.106v8.697 C22.481,26.083,27,21.075,27,15C27,8.373,21.627,3,15,3z" />
                      </svg>
                      <span class="ml-2">Share on Facebook</span>
                    </div>
                    <div class="flex hover:text-accent-lighter whitespace-nowrap cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        width="24px"
                        height="24px">
                        <path d="M 15 3.296875 C 14.476563 3.523438 13.949219 3.691406 13.367188 3.746094 C 13.949219 3.410156 14.417969 2.84375 14.648438 2.226563 C 14.066406 2.5625 13.484375 2.789063 12.84375 2.902344 C 12.257813 2.339844 11.5 2 10.683594 2 C 9.109375 2 7.824219 3.242188 7.824219 4.765625 C 7.824219 4.988281 7.824219 5.214844 7.882813 5.386719 C 4.875 5.386719 2.8125 3.691406 1.414063 2 C 1.121094 2.394531 1.003906 2.902344 1.003906 3.410156 C 1.003906 4.367188 1.53125 5.214844 2.289063 5.722656 C 1.820313 5.667969 1.355469 5.554688 1.003906 5.386719 C 1.003906 5.386719 1.003906 5.386719 1.003906 5.441406 C 1.003906 6.796875 1.996094 7.921875 3.28125 8.148438 C 3.046875 8.203125 2.8125 8.261719 2.519531 8.261719 C 2.347656 8.261719 2.171875 8.261719 1.996094 8.207031 C 2.347656 9.335938 3.976563 10.632813 5.257813 10.632813 C 4.265625 11.363281 3.34375 12 1.5 12 C 1.265625 12 1.453125 12 1 12 C 2.28125 12.789063 3.800781 13 5.375 13 C 10.683594 13 13.542969 8.769531 13.542969 5.101563 C 13.542969 4.988281 13.542969 4.878906 13.542969 4.765625 C 14.125 4.367188 14.59375 3.863281 15 3.296875" />
                      </svg>
                      <span class="ml-2">Share on Twitter</span>
                    </div>
                    <div class="flex hover:text-accent-lighter whitespace-nowrap cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        width="24px"
                        height="24px">
                        <path d="M 20.572266 3.0117188 C 20.239891 2.9764687 19.878625 3.028375 19.515625 3.171875 C 19.065625 3.348875 12.014406 6.3150313 5.4414062 9.0820312 L 3.2695312 9.9960938 C 2.4285313 10.337094 2.0039062 10.891672 2.0039062 11.638672 C 2.0039062 12.161672 2.22525 12.871063 3.28125 13.289062 L 6.9472656 14.757812 C 7.2642656 15.708813 8.0005469 17.916906 8.1855469 18.503906 C 8.2955469 18.851906 8.5733906 19.728594 9.2753906 19.933594 C 9.4193906 19.982594 9.5696563 20.007813 9.7226562 20.007812 C 10.165656 20.007812 10.484625 19.801641 10.640625 19.681641 L 12.970703 17.710938 L 15.800781 20.328125 C 15.909781 20.439125 16.486719 21 17.261719 21 C 18.228719 21 18.962234 20.195016 19.115234 19.416016 C 19.198234 18.989016 21.927734 5.2870625 21.927734 5.2890625 C 22.172734 4.1900625 21.732219 3.6199531 21.449219 3.3769531 C 21.206719 3.1694531 20.904641 3.0469688 20.572266 3.0117188 z M 19.910156 5.171875 C 19.533156 7.061875 17.478016 17.378234 17.166016 18.865234 L 13.029297 15.039062 L 10.222656 17.416016 L 11 14.375 C 11 14.375 16.362547 8.9468594 16.685547 8.6308594 C 16.945547 8.3778594 17 8.2891719 17 8.2011719 C 17 8.0841719 16.939781 8 16.800781 8 C 16.675781 8 16.506016 8.1197812 16.416016 8.1757812 C 15.272669 8.8885973 10.404094 11.662239 8.0078125 13.025391 L 4.53125 11.636719 L 6.21875 10.927734 C 10.51775 9.1177344 18.174156 5.893875 19.910156 5.171875 z" />
                      </svg>
                      <span class="ml-2">Share on Telegram</span>
                    </div>
                  </div>
                </div>
                <div
                  class="cursor-pointer"
                  title="Refresh"
                  @click="setData(true)">
                  <refresh-icon
                    class="w-6 h-6"
                    :class="rotateRefreshIcon ? 'animate-spin' : ''" />
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 mb-4 bg-gray-900 rounded-md">
            <p class="mb-2 text-sm text-gray-400">
              Current Price
            </p>
            <div class="flex gap-2 items-center mb-4 text-xl">
              <TagIcon class="w-6 h-6 text-primary" />
              <span v-if="nft && nft.listingPrice !== 0">{{ $filters.sol(nft.listingPrice) }} {{ nft.tokenSymbol.label }}</span>
              <span v-else>Not Listed</span>
            </div>
            <template v-if="nft.sourceType && nft.sourceType.value != 0">
              <div class="flex gap-2 mb-2">
                <button
                  class="py-3 w-full text-lg text-black bg-accent-light hover:bg-accent-lighter rounded-md"
                  @click="redirectToSource(nft.sourceUrl)">
                  Buy Now
                </button>
              </div>
            </template>
            <template v-else-if="userType === 'buyer'">
              <div
                v-if="isWalletConnected"
                class="gap-2 mb-2">
                <div class="flex gap-2 mb-2">
                  <button
                    class="py-3 w-full text-lg text-black bg-accent-light hover:bg-accent-lighter rounded-md"
                    @click.prevent="toggleBuyModal(true)">
                    Buy Now
                  </button>
                  <button
                    class="py-3 w-full text-lg text-accent-light bg-transparent rounded-md border border-accent-light"
                    @click.prevent="toggleOfferModal(true)">
                    Make an offer
                  </button>
                </div>
                <div class="text-sm text-gray-400">
                  <p>
                    By clicking "Buy Now" or "Make on offer", you agree to
                    <a
                      class="text-gray-200 hover:underline"
                      href="#">Terms of Service</a>
                  </p>
                </div>
              </div>
              <wallet-multi-button
                v-else
                class="py-3 w-full h-auto text-lg text-black bg-primary rounded-md" />
            </template>
            <template v-else>
              <div class="flex gap-4 items-center">
                <div class="w-2/3">
                  <base-input
                    v-model="listPrice"
                    placeholder="Price (SOL)"
                    type="number" />
                </div>
                <div class="w-1/3">
                  <BaseButton
                    class="w-full"
                    type="primary"
                    @click.prevent="submitForSale">
                    List Now
                  </BaseButton>
                </div>
              </div>
              <div class="mt-2">
                <p class="mb-2 text-sm text-gray-400">
                  Collection Name
                </p>
                <select
                  v-model="collectionId"
                  class="text-white bg-transparent focus:outline-none">
                  <option
                    v-for="collection in collections"
                    :key="collection.id"
                    class="bg-black"
                    :value="collection.id">
                    {{ collection.name }}
                  </option>
                </select>
              </div>
            </template>
          </div>

          <AssetAbout
            :nft="nft"
            class="mb-2" />
          <AssetAttributes
            :nft="nft"
            class="mb-2" />
          <AssetDetail
            :nft="nft"
            class="mb-2" />
        </div>
      </div>

      <div>
        <AssetActivities
          v-if="nft"
          :nft="nft"
          class="mb-2" />
        <AssetMoreFromCollection
          v-if="$route.params.id != 0"
          class="mb-2" />
      </div>
    </div>
    <div
      v-else
      class="flex justify-center items-center h-64">
      <LoadingIndicator />
    </div>

    <!-- Buy now modal -->
    <base-modal
      no-header
      :show="showBuyModal"
      @close="toggleBuyModal">
      <loading-indicator class="flex justify-center mb-4" />
      <div class="mt-2">
        <p class="text-sm text-gray-300">
          After wallet approval. Your transaction will be finished in 3s.
        </p>
      </div>
    </base-modal>
    <!-- Offer Modal -->

    <base-modal
      title="Make an offer"
      :show="showOfferModal"
      @close="toggleOfferModal">
      <label class="text-gray-300">Price</label>
      <base-input
        v-model="offerPrice"
        placeholder="0.25" />
      <template #footer>
        <button
          type="button"
          class="inline-flex justify-center py-2 px-4 w-full text-base font-medium text-black bg-primary hover:bg-green-500 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm sm:text-sm"
          @click.prevent="submitOffer"
          @click="close">
          Make offer
        </button>
      </template>
    </base-modal>

    <base-modal
      title="Set an alert"
      :show="showPriceAlertModal"
      @close="togglePriceAlertModal(false)">
      <div class="mb-4">
        <label class="block mb-2 text-gray-300">Condition</label>
        <base-select
          v-model="priceType"
          class="w-full text-white bg-black"
          :options="priceTypeOptions" />
      </div>

      <div class="mb-4">
        <label class="block mb-2 text-gray-300">Price</label>
        <base-input
          v-model="price"
          placeholder="10"
          icon-position="right">
          <template #icon>
            <img src="@/assets/solana-icon.png">
          </template>
        </base-input>
      </div>

      <div class="mb-4">
        <label class="block mb-2 text-gray-300">Expired date</label>
        <base-input
          v-model="expiredDate"
          icon-position="right"
          :min="currentDate()"
          :max="maxDate()"
          type="date">
          <template #icon>
            <CalendarIcon class="w-5 h-5 text-gray-300" />
          </template>
        </base-input>
      </div>

      <template #footer>
        <button
          type="button"
          class="inline-flex justify-center py-2 px-4 w-full text-base font-medium text-black bg-primary hover:bg-green-500 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm sm:text-sm"
          @click.prevent="createPriceAlert"
          @click="close">
          Create
        </button>
      </template>
    </base-modal>

    <LoadingDialog
      :open="isProcessing"
      title="Processing" />
  </div>
</template>
<script>
import moment from 'moment';
import Accordian from "@/components/shared/Accordian";
import {
  BellIcon,
  ChartBarIcon,
  ShareIcon,
  RefreshIcon,
  CalendarIcon,
  TagIcon,
} from "@heroicons/vue/outline";
import {
  ClipboardCopyIcon,
} from "@heroicons/vue/solid";
import BaseModal from "@/components/shared/BaseModal";
import BaseInput from "../components/shared/BaseInput.vue";
import BaseSelect from "../components/shared/BaseSelect.vue";
import {
  getAssetDetails,
  postAssetPriceAlert,
  postListNFTs,
  postAssetListOffer,
  getPriceHistory,
  getCollectionNames
} from "../api/collections";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import _delay from 'lodash/delay'

import { WalletMultiButton } from '@solana/wallet-adapter-vue-ui'

import AssetMoreFromCollection from "../components/Asset/AssetMoreFromCollection.vue";
import AssetDetail from "../components/Asset/AssetDetail.vue";
import AssetAttributes from "../components/Asset/AssetAttributes.vue";
import AssetAbout from "../components/Asset/AssetAbout.vue";
import AssetActivities from "../components/Asset/AssetActivities.vue";

function epoch(date) {
  return Date.parse(date);
}
export default {
  components: {
    WalletMultiButton,
    Accordian,
    BaseModal,
    BellIcon,
    ChartBarIcon,
    ShareIcon,
    RefreshIcon,
    TagIcon,
    ClipboardCopyIcon,
    BaseInput,
    BaseSelect,
    Vue3ChartJs,
    CalendarIcon,
    AssetMoreFromCollection,
    AssetDetail,
    AssetAttributes,
    AssetAbout,
    AssetActivities,
  },
  data: () => ({
    rotateRefreshIcon: false,
    showShareDropdown: false,
    isProcessing: false,
    showBuyModal: false,
    showOfferModal: false,
    showPriceAlertModal: false,
    priceAlertOption: "less",
    collections: [],
    priceAlertOptions: [
      {
        label: "More than",
        value: "more",
      },
      {
        label: "Less than",
        value: "less",
      },
    ],
    priceTypeOptions: [
      {
        label: "Above Price",
        value: 0,
      },
      {
        label: "Below Price",
        value: 1,
      },
    ],
    priceHistory: {
      labels: [],
      datasets: [
        {
          label: "Average Price",
          backgroundColor: ["#41B883"],
          data: [],
          borderColor: "#41B883",
          tension: 0.5,
        },
      ],
    },
    chartOptions: {
      plugins: {},
    },

    collectionId: null,
    listPrice: null,
    price: null,
    expiredDate: null,
    nft: null,
    filter: {
      sourceTypes: [],
      minPrice: null,
      maxPrice: null,
      attributes: [],
    },
  }),
  computed: {
    // TODO: Remove it during integration with wallet. This is just for demo.
    userType() {
      return this.$route.query.userType || "buyer";
    },
    solanaPrice() {
      return this.$store.getters.solanaPrice;
    },
    isWalletConnected() {
      return this.$store.getters.isWalletConnected;
    },
  },
  created() {
    this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'setUserWallet') {
          if (state.user.wallet) {
            this.setData()
          }
        }
    })
  },
  mounted() {
    this.fetchPriceHistory()
    this.setData()
  },
  methods: {
    currentDate() {
      const current = new Date();
      const finalDate = moment(String(current)).format('YYYY-MM-DD');
      return finalDate;
    },
     maxDate() {
      const current = new Date();
      const finalDate = moment(String(current)).add(7, "days").format('YYYY-MM-DD');
      return finalDate;
    },
    createPriceAlert() {
      var assertPriceAlertPayload = {
          price: this.price * 1000000000,
          expiredDate: epoch(this.expiredDate),
          asset: {
            id: this.$route.params.assetId,
          },
          user:  {
            id: "",
          },
          priceType: this.priceType,
          status: "1",
      };
      postAssetPriceAlert(assertPriceAlertPayload).then((response) => {
            if (response.success) {
              //TODO - Page is stick at the screen and don't able to scroll down while using emit function 
               this.emitter.emit('alert', { type: 'success', title: 'Yeay!', message: 'It is done!' })
            }
            else{
              this.emitter.emit('alert', { type: 'error', 'title': 'Alert failed', 'message': 'Please fill all the details.'})
            }
          this.showPriceAlertModal = false;
          this.price = null ;
          this.expiredDate = null ;
      });
    },  
    redirectToSource(url) {
      window.open(url,"_self")
    },
    setData(isReload = false) {
      if (this.$route.query.userType == "seller") {
        if(this.isWalletConnected) {
          this.getCollections();
          this.getNftsForOwner(isReload);
        }
      } else {
        this.getAsset(isReload);
      }
    },
    fetchPriceHistory() {
      getPriceHistory(this.$route.params.assetId).then((response) => {
        response.data.forEach((label) => {
          label = label.createdOn;
          this.priceHistory.labels.push(label);
        });
        response.data.forEach((data) => {
          data = this.$filters.crypto(data.price);
          this.priceHistory.datasets[0].data.push(data);
        });
      });
    },
    async copyURL() {
      try {
        await navigator.clipboard.writeText(window.location.href);
        this.emitter.emit('notification', { type: 'success', message: 'Copied to clipboard' })
      } catch($e) {
        this.emitter.emit('notification', { type: 'error', message: 'Could not copy to clipboard' })
      }
    },
    showDropdown() {
      this.showShareDropdown = !this.showShareDropdown;
    },
    closeShareDropdown() {
      this.showShareDropdown = false;
    },
    getAsset(isReload = false) {
      let me = this
      this.rotateRefreshIcon = isReload;
      if (this.$route.params.assetId) {
        getAssetDetails(this.$route.params.assetId).then((response) => {
          _delay(function() {
              me.rotateRefreshIcon = false;
          }, 500)
          
          const { data } = response;
          var listingPrice = 0
          data.assetListList.forEach(assetList => {
            if(assetList.listStatus.value == 0) {
              listingPrice = assetList.price
            }
          })
          data['listingPrice'] = listingPrice
          this.nft = data;
        }).catch(function (error) {
          me.rotateRefreshIcon = false;
        });
      }
    },
    getCollections() {
      var me = this;
      getCollectionNames().then((response) => {
        me.collections = response.data;
      }).catch(function (error) {
        me.collections = []
      });
    },
    toggleBuyModal() {
      // this.showBuyModal = status;
      var me = this;
      this.nft.assetListList.forEach((asset) => {
        if (asset.listStatus.label == "Listed") {
          me.offerPrice = asset.price / LAMPORTS_PER_SOL;
        }
      });
      this.directBuy();
    },
    toggleOfferModal(status) {
      this.showOfferModal = status;
    },
    togglePriceAlertModal(status) {
      this.showPriceAlertModal = status;
    },
    async directBuy() {
      var me = this;
      var result = await me.$store.dispatch("directBuy", {
        mintaddress: me.nft.mintId ? me.nft.mintId : me.nft.chainTokenId,
        price: me.offerPrice,
      });
      if (result.err) {
        this.emitter.emit("alert", {
          type: "error",
          title: "Transaction failed",
          message: result.err.message,
        });
      } else {
        var payload = {
          assetId: me.nft.id,
          price: LAMPORTS_PER_SOL * me.offerPrice,
          listOfferStatus: 1,
          txAddress: result.hash,
        };
        await postAssetListOffer(payload).then((response) => {
          console.log(response);
        });
        this.emitter.emit("alert", {
          type: "success",
          message: "Successful transaction",
        });
        this.$router.push({ name: "UserProfile" });
      }
    },
    async submitOffer() {
      var me = this;
      var result = await me.$store.dispatch("makeOffer", {
        mintaddress: me.nft.mintId ? me.nft.mintId : me.nft.chainTokenId,
        price: me.offerPrice,
      });
      if (result.err) {
        this.emitter.emit("alert", {
          type: "error",
          title: "Transaction failed",
          message: result.err.message,
        });
      } else {
        this.emitter.emit("alert", {
          type: "success",
          message: "Successful transaction",
        });
        var payload = {
          assetId: me.nft.id,
          price: LAMPORTS_PER_SOL * me.offerPrice,
          txAddress: result.hash,
        };
        await postAssetListOffer(payload).then((response) => {
          console.log(response);
        });
        this.toggleOfferModal(false);
        this.$router.push({ name: "UserProfile" });
      }
    },
    async submitForSale() {
      var me = this;
      if(!me.collectionId) {
        this.emitter.emit("alert", {
          type: "error",
          title: "Collection",
          message: "Please select collection before listing",
        });
        return false;
      }
      this.isProcessing = true
      var result = await me.$store.dispatch("listNft", {
        mintaddress: me.nft.mintId ? me.nft.mintId : me.nft.chainTokenId,
        price: me.listPrice,
      });
      if (result.err) {
        console.log(result.err)
        this.isProcessing = false
        this.emitter.emit("alert", {
          type: "error",
          title: "Transaction failed",
          message: result.err.message,
        });
      } else {
        var payload = {
          assetHash: result.hash,
          imageUrl: me.nft.imageUrl,
          name: me.nft.name,
          tokenSymbol: 0,
          supply: 1,
          chainSmartContractAddress: "xxx",
          chainType: 0,
          chainTokenId: me.nft.mintId,
          sourceType: 0,
          assetListPrice: LAMPORTS_PER_SOL * me.listPrice,
          assetListStatus: true,
          verificationStatus: 1,
          assetPrice: {
            price: LAMPORTS_PER_SOL * me.listPrice,
            status: true,
          },
        };
        if (me.collectionId) {
          payload["collection"] = {
            id: me.collectionId,
          };
          payload["assetTraitList"] = [
            {
              traitType: "National Park",
              value: "Capital Reef",
              displayType: 0,
              intValue: 0,
              maxValue: 100,
            },
          ];
        } else {
          payload["collection"] = {
            logoImage: "xxx",
            name: "Small Monkey business",
            description: "Test Description",
            category: 0,
            chainType: 0,
            tokenSymbol: 0,
            isVerified: true,
            sourceType: 0,
            blueChipType: 0,
          };
        }
        await postListNFTs(payload).then((response) => {
          console.log(response);
        });
        this.isProcessing = false
        this.emitter.emit("alert", {
          type: "success",
          message: "Successful transaction",
        });
        this.$store.dispatch("getWalletItems")
        this.$store.dispatch("getAssetsOwned")
        this.$router.push({ name: "UserProfile" });
      }
    },
    close() {
      // this.$router.go() //Refresh Page.
    },
    async getNftsForOwner(isReload = false) {
      let me = this
      this.rotateRefreshIcon = isReload;
      var result = await me.$store.dispatch("getNftsForOwner", {
        assetId: me.$route.params.assetId,
      });
      me.nft = result;
      _delay(function() {
          me.rotateRefreshIcon = false;
      }, 500)
    },
  },
};
</script>
