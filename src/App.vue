<template>
  <div id="app" class="min-h-screen bg-black font-sans text-white antialiased">
    <wallet-provider :wallets="wallets" autoConnect>
      <workspace-provider>
        <wallet-modal-provider>
          <router-view />
        </wallet-modal-provider>
      </workspace-provider>
    </wallet-provider>
  </div>
</template>
<script>
export default {
  mounted() {
    if (localStorage.Lang != null) this.$i18n.locale = localStorage.Lang
    this.$store.dispatch("fetchExchangeRate")
  },
}
</script>

<script setup>
import { getPhantomWallet } from "@solana/wallet-adapter-wallets"
import { WalletProvider } from "@solana/wallet-adapter-vue"
import { WalletModalProvider } from "@solana/wallet-adapter-vue-ui"
import WorkspaceProvider from "../src/components/WorkspaceProvider.vue"
import "@solana/wallet-adapter-vue-ui/styles.css"
const wallets = [getPhantomWallet()]
</script>
