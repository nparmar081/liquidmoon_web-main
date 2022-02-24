import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import "./assets/tailwind.css"

const app = createApp(App)

import VueClickAway from "vue3-click-away";
app.use(VueClickAway)

import mitt from "mitt";
const emitter = mitt();
app.config.globalProperties.emitter = emitter;

import en from "./locales/en.json"
import ja from "./locales/ja.json"
const messages = {
  en: en,
  ja: ja,
}
import { createI18n } from "vue-i18n"
const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages,
})
app.use(i18n)

app.config.globalProperties.$filters = {
  currency: (value) => {
    return Math.ceil(Number(value))
      .toString()
      .replace(/^0*(.+)/, "$1")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  },
  crypto: (value) => {
    if (value % 1 === 0) return (value / 1000000000).toFixed(0)
    return (value / 1000000000).toFixed(2)
  },
  sol: (value) => {
    return (value / 1000000000).toFixed(2)
  },
  tokentrim: (value) => {
    var toSplit = 5
    if (value == null || value <= toSplit) {
      return value
    } else {
      return value.substring(0, toSplit) + "..." + value.slice(-3)
    }
  },
  timerel: (value) => {
    value = new Date(value)
    var seconds = Math.floor((new Date() - value) / 1000)
    var inHour = 3600
    var inDay = 86400
    if (seconds < inHour) {
      var inMinValue = seconds / 60
      return "About " + Math.floor(inMinValue) + " min ago"
    }
    if (seconds >= inHour && seconds < inDay) {
      var inHourValue = seconds / inHour
      return "About " + Math.floor(inHourValue) + " hour ago"
    } else {
      var inDayValue = seconds / inDay
      return "About " + Math.floor(inDayValue) + " day ago"
    }
  },
}

import BaseButton from "./components/shared/BaseButton.vue";
app.component("BaseButton", BaseButton);

import BaseModal from "./components/shared/BaseModal.vue";
app.component("BaseModal", BaseModal);

import LoadingIndicator from "./components/shared/LoadingIndicator.vue"
app.component("LoadingIndicator", LoadingIndicator)

import LoadingDialog from "./components/shared/LoadingDialog.vue";
app.component("LoadingDialog", LoadingDialog);

import EmptyState from "./components/shared/EmptyState.vue"
app.component("EmptyState", EmptyState)

app.use(store).use(router).mount("#app")
