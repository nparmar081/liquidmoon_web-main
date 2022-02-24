<template>
  <section
    class="px-4 bg-black text-white text-xs font-mono border-b border-gray-700"
  >
    <div class="container flex justify-between">
      <div class="flex space-x-2 items-center">
        <div
          v-if="nft.isVerified"
          class="
            flex
            space-x-2
            py-2
            items-center
            border-r border-l border-gray-700
            px-2
          "
        >
          <img src="@/assets/icons/checkmark.svg" />
          <span class="mr-3">Verified Collection</span>
        </div>
        <div
          class="flex space-x-2 py-2 items-center border-r border-gray-700 px-2"
        >
          <img src="@/assets/icons/diamond.svg" />
          <span class="mr-3">{{ nft.blueChipType }}</span>
        </div>
      </div>
      <div class="flex space-x-2 items-center">
        <div
          v-if="nft.website"
          class="
            flex
            space-x-2
            py-2
            items-center
            border-r border-l border-gray-700
            px-2
          "
        >
          <a :href="nft.website" target="_blank">
            <img src="@/assets/icons/website.svg" class="h-4 w-4" />
          </a>
        </div>
        <div
          v-if="nft.discord"
          class="flex space-x-2 py-2 items-center border-r border-gray-700 px-2"
        >
          <a :href="nft.discord" target="_blank">
            <img src="@/assets/icons/discord.svg" class="h-4 w-4" />
          </a>
        </div>
        <div
          v-if="nft.twitter"
          class="flex space-x-2 py-2 items-center border-r border-gray-700 px-2"
        >
          <a :href="nft.twitter" target="_blank">
            <img src="@/assets/icons/twitter.svg" class="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    nft: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>
