<template>
  <div>
    <statistic />
    <div
      class="relative bg-black bg-no-repeat bg-cover"
      :style="{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.00) 9%, #000000 95%), url(${headerImage})`}">
      <navigation />
      <div
        v-if="currentRoute == 'Home'"
        class="py-24 mx-auto max-w-3xl">
        <h1 class="mb-4 text-4xl text-center text-white">
          {{ $t("home.headline") }}
        </h1>
        <searchbar />
      </div>
    </div>
    <router-view />
    <l-footer />
    <base-notification
      :open="notificationOpen"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      @notification-close="closeNotification" />
    <base-alert
      :open="alertOpen"
      :type="alert.type"
      :title="alert.title"
      :message="alert.message"
      :button-text="alert.buttonText"
      @alert-close="alertOpen = false" />
  </div>
</template>
<script>
import Navigation from "@/components/Navigation.vue"
import Statistic from "@/components/Statistic.vue"
import Searchbar from "@/components/Searchbar.vue"
import LFooter from "@/components/L-Footer.vue"
import BaseNotification from "@/components/shared/BaseNotification.vue"
import BaseAlert from "@/components/shared/BaseAlert.vue"

import CoverImage from "@/assets/cover.png"
import HeroImage from "@/assets/hero-bg.png"

import { useWorkspace } from "@/composables"

export default {
  components: { Navigation, Searchbar, Statistic, LFooter, BaseNotification, BaseAlert },
  data: () => ({
    notification: {
      type: "success",
      message: "Notification message",
    },
    notificationOpen: false,
    alert: {
      type: "info",
      message: "This is an alert",
    },
    alertOpen: false,
    HeroImage,
  }),
  computed: {
    currentRoute() {
      return this.$route.name
    },
    headerImage() {
      if (this.currentRoute == 'Home') {
        return HeroImage
      }
      return CoverImage
    }
  },
  created() {
    this.emitter.on("notification", data => {
      this.showNotification(data)
    });
    this.emitter.on("alert", data => {
      this.showAlert(data)
    });
  },
  mounted() {
    const { connection, mplTokenMetadata, program, provider } = useWorkspace()
    this.$store.dispatch("loginWallet", {
      provider: provider,
      connection: connection,
      mplTokenMetadata: mplTokenMetadata,
      program: program,
    })
  },
  methods: {
    showNotification(data) {
      this.notification = data
      this.notificationOpen = true
    },
    closeNotification() {
      this.notification.message = ""
      this.notificationOpen = false
    },
    showAlert(data) {
      this.alert = data
      this.alertOpen = true
    },
  },
}
</script>
