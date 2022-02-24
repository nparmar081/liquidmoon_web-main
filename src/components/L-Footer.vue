<template>
  <section>
    <div class="banner py-2">
      <p class="text-center text-sm">
        We love to hear from the community. Have a suggestion or interested in
        partnerships? Drop us a message at moon@liquidmoon.io
      </p>
    </div>
    <footer class="bg-black">
      <div class="container flex space-x-4 py-8">
        <div class="w-1/4">
          <img src="@/assets/logo.png" class="w-48 h-auto" />
        </div>
        <div class="w-1/2">
          <h4 class="text-lg font-semibold">Stay in the loop</h4>
          <p>
            Join our mailing list to stay in the loop with our newest feature
            releases!
          </p>
          <div class="mt-1 flex items-center space-x-4">
            <base-input placeholder="Your email address"></base-input>
            <l-button variant="primary">Sign Up</l-button>
          </div>
        </div>
        <div class="w-1/4">
          <h4 class="mb-4 text-lg font-semibold">
            Join the community
          </h4>
          <div class="flex items-center space-x-4">
            <a
              href="#"
              class="bg-gray-800 p-3 rounded-md h-10 w-10 flex items-center justify-center"
            >
              <img src="@/assets/icons/twitter.svg" />
            </a>
            <a
              href="#"
              class="bg-gray-800 p-3 rounded-md h-10 w-10 flex items-center justify-center"
            >
              <img src="@/assets/icons/discord.svg" />
            </a>
            <a
              href="#"
              class="bg-gray-800 p-3 rounded-md h-10 w-10 flex items-center justify-center"
            >
              <img src="@/assets/icons/instagram.svg" />
            </a>
            <a
              href="#"
              class="bg-gray-800 p-3 rounded-md h-10 w-10 flex items-center justify-center"
            >
              <img src="@/assets/icons/mail.svg" />
            </a>
          </div>
        </div>
      </div>
      <div class="container">
        <div
          class="flex items-center justify-between border-t border-gray-700 py-4"
        >
          <span>We use 🍪</span>
          <span>
            <a href="#">Terms of Service</a>
          </span>
        </div>
      </div>
    </footer>
  </section>
</template>

<script>
import BaseInput from './shared/BaseInput.vue'
import LButton from './shared/LButton.vue'
export default {
  components: { LButton, BaseInput },
}
</script>

<style scoped>
.banner {
  background-image: linear-gradient(
    42deg,
    #9945ff 0%,
    #8a53f4 14%,
    #6377d6 42%,
    #24b0a7 79%,
    #00d18c 99%,
    #00d18c 100%
  );
}
</style>
