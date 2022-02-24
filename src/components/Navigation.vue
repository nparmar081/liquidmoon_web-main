<template>
  <div class="bg-transparent py-4 text-white">
    <div class="container flex items-center justify-between h-5">
      <router-link to="/">
        <img src="@/assets/logo.png" />
      </router-link>

      <div class="flex space-x-5 items-center">
        <router-link to="/Watchlist" class="cursor-pointer border-b border-transparent hover:border-white">Watchlist</router-link>
        <router-link to="/sell" class="cursor-pointer border-b border-transparent hover:border-white">Create</router-link>
        <div class="cursor-pointer border-b border-transparent hover:border-white relative" @click="showDrop">Community
          <div class="bg-brand-darker w-36 rounded-sm overflow-hidden absolute left-0 top-10 z-50"
            v-if="showCommunityDropdown" v-click-away="closeCommunityDropdown">
            <div class="divide-y divide-gray-800">
              <div class="cursor-pointer px-3 py-2 hover:bg-brand-dark" href="https://twitter.com/" target="blank">
                Twitter</div>
              <div class="cursor-pointer px-3 py-2 hover:bg-brand-dark" href="https://discord.com/" target="blank">
                Discord</div>
              <div class="cursor-pointer px-3 py-2 hover:bg-brand-dark" href="https://www.podcasts.com/"
                target="blank">Podcast</div>
              <div class="cursor-pointer px-3 py-2 hover:bg-brand-dark" href="#contact" target="blank">FAQ</div>
              <div class="cursor-pointer px-3 py-2 hover:bg-brand-dark" href="#contact" target="blank">Blog</div>
              <div class="cursor-pointer px-3 py-2 hover:bg-brand-dark" href="#contact" target="blank">Shop</div>
            </div>
          </div>
        </div>
        <router-link to="/me"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 496 512"
            class="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M248 104c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4 14.9-23 40.4-38.6 69.6-39.5 20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9-10.2 0-26 9.6-57.6 9.6-31.5 0-47.4-9.6-57.6-9.6-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z">
            </path>
          </svg></router-link>
        <div class="flex items-center w-6 h-6 relative" @click="showLang">
          <svg stroke="currentColor" class="cursor-pointer" fill="currentColor" stroke-width="0" viewBox="0 0 496 512"
            height="2em" width="2em" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z">
            </path>
          </svg>
          <div class="bg-brand-darker w-36 rounded-sm overflow-hidden absolute left-0 top-10 z-50"
            v-if="showLanguageDropdown" v-click-away="closeLanguageDropdown">
            <div class="divide-y divide-gray-800">
              <div class="cursor-pointer px-3 py-2 hover:bg-brand-dark" @click="changeLocale('en')">English</div>
              <div class="cursor-pointer px-3 py-2 hover:bg-brand-dark" @click="changeLocale('ja')">日本語</div>
              <div class="cursor-pointer px-3 py-2 hover:bg-brand-dark" @click="changeLocale('zh')">ZH</div>
            </div>
          </div>
        </div>
        <router-link to="/comingsoon"
          class="font-mono whitespace-nowrap text-xs bg-brand-light rounded-full px-4 py-1.5">
          Coming soon
        </router-link>
        <wallet-multi-button class="rounded-md bg-transparent hover:bg-brand-dark border border-solid border-brand-dark text-sm leading-none"></wallet-multi-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { WalletMultiButton } from '@solana/wallet-adapter-vue-ui'
  export default {
    components: {
      WalletMultiButton
    },
    data: () => ({
      showCommunityDropdown: false,
      showLanguageDropdown: false
    }),
    methods: {
      showDrop() {
        this.showCommunityDropdown = !this.showCommunityDropdown
      },
      showLang() {
        this.showLanguageDropdown = !this.showLanguageDropdown
      },
      changeLocale(locale) {
        this.$i18n.locale = locale
        localStorage.Lang = this.$i18n.locale
      },
      connectWallet() {
        console.log(`connect wallet...`)
      },
      closeCommunityDropdown() {
        this.showCommunityDropdown = false
      },
      closeLanguageDropdown() {
        this.showLanguageDropdown = false
      }
    },
  }
</script>
