<template>
  <div class="container py-16 lg:grid lg:grid-cols-12 lg:gap-x-5">
    <aside class="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
      <nav class="space-y-1">
        <a
          v-for="item in navigation"
          :key="item.name"
          :class="[
            item.current
              ? 'bg-gray-800 text-white hover:bg-gray-900 hover:text-gray-200'
              : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
            'group flex items-center rounded-md px-3 py-2 text-sm font-medium',
          ]"
          :aria-current="item.current ? 'page' : undefined">
          <component
            :is="item.icon"
            :class="[
              item.current
                ? 'text-purple group-hover:text-indigo-500'
                : 'text-gray-400 group-hover:text-gray-500',
              '-ml-1 mr-3 h-6 w-6 flex-shrink-0',
            ]"
            aria-hidden="true" />
          <span class="truncate">
            {{ item.name }}
          </span>
        </a>
      </nav>
    </aside>

    <div class="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
      <form method="PUT">
        <div class="shadow sm:overflow-hidden sm:rounded-md">
          <div class="space-y-6 bg-gray-900 py-6 px-4 sm:p-6">
            <div>
              <h3 class="text-lg font-medium leading-6 text-white">
                Edit Profile
              </h3>
              <p class="mt-1 text-sm text-gray-200">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>

            <div class="user-info">
              <div class="grid grid-cols-3 gap-3">
                <div>
                  <labeL>Display Name</labeL>
                  <input type="text" v-model="userDetails.displayName" />
                </div>
                <div>
                  <label>Username</label>
                  <input type="text" v-model="userDetails.userName" />
                </div>
                <div>
                  <label>Email</label>
                  <input type="email" v-model="userDetails.emailAddress" />
                </div>
              </div>
              <div class="grid grid-cols-1">
                <div>
                  <label>Bio</label>
                  <textarea rows="5" v-model="userDetails.bio"></textarea>
                </div>
              </div>
              <div>
                <button @click.prevent="updateUserProfile()">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { UserCircleIcon } from "@heroicons/vue/outline"
import BaseInput from "../../components/shared/BaseInput.vue"
import LButton from "../../components/shared/LButton.vue"
import {
  getUserDetails,
  getUserAndUpdateDetails,
} from "../../api/collections.js"

const navigation = [
  { name: "Profile", href: "#", icon: UserCircleIcon, current: true },
]
export default {
  components: {
    UserCircleIcon,
    BaseInput,
    LButton,
  },
  data: () => ({
    userDetails: [],
    navigation: navigation,
    userName: "",
    displayName: "",
    bio: "",
    emailAddress: "",
  }),
  computed: {
    connectWallet() {
      return this.$store.getters.isWalletConnected;
    },
  },
  watch: {
    connectWallet(isWalleteConnected) {
      if(!isWalleteConnected) {
        this.$router.push({ name: "UserProfile" });
      }
    }
  },
  mounted() {
    this.fetchUserDetails()
  },
  methods: {
    fetchUserDetails() {
      if(this.connectWallet) {
        getUserDetails().then((response) => {
          this.userDetails = response.data
        })
      } else {
        this.$router.push({ name: "UserProfile" });
      }
    },

    updateUserProfile() {
      const payload = {
        userName: this.userDetails.userName,
        displayName: this.userDetails.displayName,
        bio: this.userDetails.bio,
        emailAddress: this.userDetails.emailAddress,
      }
      getUserAndUpdateDetails(payload).then((response) => {
        if (response.success) {
          this.emitter.emit("alert", {
            type: "success",
            title: "Yeay!",
            message: "The details has been changed.",
          })
        } else {
          this.emitter.emit("alert", {
            type: "error",
            title: "Edit details failed",
            message: "Please fill the proper details.",
          })
        }
      })
    },
  },
}
</script>

<style scoped>
.user-info div {
  padding: 10px 0;
}
.user-info div button {
  background-color: #120c18;
  padding: 5px 20px;
  border-radius: 6px;
  border: 1px solid #41354d;
  color: #89837d;
}
.user-info div button:hover {
  background-color: #41354d;
  transition: 0.5s;
}
.user-info div label {
  display: block;
  margin-bottom: 5px;
  color: #89837d;
}
.user-info div input {
  width: 100%;
  height: 40px;
  border-radius: 6px;
  border: 2px solid #41354d;
  background-color: #120c18;
}
.user-info div input:focus {
  outline: none;
  box-shadow: none;
}
.user-info div textarea:focus {
  outline: none;
  box-shadow: none;
}
.user-info div textarea {
  width: 100%;
  border-radius: 6px;
  border: 2px solid #41354d;
  background-color: #120c18;
}
</style>
