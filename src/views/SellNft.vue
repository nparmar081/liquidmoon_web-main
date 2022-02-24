<template>
  <div class="container py-16">
    <template v-if="isWalletConnected">
      <h1 class="mb-4 text-4xl font-bold">
        Create new items
      </h1>

      <section class="grid gap-4 max-w-2xl">
        <div>
          <label class="block mb-2 text-lg">
            Image, Video, Audio, or 3D Model
          </label>

          <div class="mt-1 sm:col-span-2 sm:mt-0">
            <div v-if="file">
              <img
                v-if="filePreviewUrl"
                :src="filePreviewUrl"
                class="max-w-sm">
              <div
                v-else
                class="py-2 px-4 text-white bg-accent-dark rounded-md">
                {{ file['name'] }}
                <div class="text-sm text-gray-200">
                  {{ file['type'] }}
                </div>
              </div>
            </div>
            <div
              v-else
              class="flex justify-center p-6 max-w-lg rounded-md border-2 border-gray-600 border-dashed"
              @drop="dragFile">
              <div class="space-y-1 text-center">
                <PhotographIcon class="mx-auto w-12 h-12 text-gray-400" />
                <div class="flex text-sm text-gray-600">
                  <label
                    for="file-upload"
                    class="relative font-medium text-accent-light hover:text-accent-lighter rounded-md focus-within:outline-none cursor-pointer">
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      class="sr-only"
                      @change="uploadFile">
                  </label>
                  <p class="pl-1">
                    or drag and drop
                  </p>
                </div>
                <p class="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <label class="text-lg">Name</label>
          <base-input placeholder="item name" />
        </div>

        <div>
          <label class="text-lg">External link</label>
          <small class="block mb-2 text-gray-300">
            OpenSea will include a link to this URL on this item's detail page, so
            that users can click to learn more about it. You are welcome to link
            to your own webpage with more details.
          </small>
          <base-input placeholder="https://yoursite.io/item/123" />
        </div>

        <div>
          <label class="text-lg">Royalties</label>
          <small class="block mb-2 text-gray-300">
            Please set the percentage of revenue you wish to receive from
            secondary sales of your NFT.
          </small>
          <base-input
            placeholder="10"
            icon-position="right">
            <template #icon>
              <!-- <PhotographIcon class="h-4 w-4" /> -->
              <span>%</span>
            </template>
          </base-input>
        </div>

        <div>
          <label class="text-lg">Description</label>
          <small class="block mb-2 text-gray-300">
            The description will be included on the item's detail page underneath
            its image
          </small>
          <textarea
            rows="5"
            class="block py-2 w-full text-white bg-black rounded-lg border border-secondary"
            placeholder="Provide a detailed description of your item" />
        </div>

        <div>
          <label class="text-lg">Collection</label>
          <small class="block mb-2 text-gray-300">
            This is the collection where your item will appear
          </small>
          <base-select
            class="w-full"
            :options="collections" />
        </div>

        <div>
          <label class="text-lg">Traits</label>
          <small class="block mb-2 text-gray-300">
            Please provide the traits of your NFT. You can add more than one
            trait.
          </small>
          <div
            v-for="(trait, index) in traits"
            :key="index"
            class="flex flex-wrap mb-4">
            <div class="pr-1 w-1/2">
              <base-input placeholder="e.g: Color" />
            </div>
            <div class="pl-1 w-1/2">
              <base-input placeholder="e.g: Red" />
            </div>
          </div>

          <BaseButton
            type="outline"
            @click="addTrait">
            Add trait
          </BaseButton>
        </div>

        <BaseButton
          type="primary"
          class="mt-6 w-full">
          Create Item
        </BaseButton>
      </section>
    </template>
    <empty-state
      v-else
      title="Create new items">
      <template #icon>
        <photograph-icon
          class="mx-auto w-12 h-12 text-gray-400" />
      </template>
      Connect wallet to create new items
    </empty-state>
  </div>
</template>

<script>
import BaseInput from '../components/shared/BaseInput.vue'
import BaseSelect from '../components/shared/BaseSelect.vue'
import { PhotographIcon } from '@heroicons/vue/solid'
export default {
  components: { BaseInput, BaseSelect, PhotographIcon },
  data: () => ({
    previewFileTypes: ['image/jpeg', 'image/gif', 'image/png'],
    file: null,
    collections: [
      {
        label: 'Collection A',
        value: 'Collection A',
      },
      {
        label: 'Collection B',
        value: 'Collection B',
      },
    ],
    traits: [],
  }),
  computed: {
    isWalletConnected() {
      return this.$store.getters.isWalletConnected;
    },
    filePreviewUrl() {
      if (this.file) {
        if (this.previewFileTypes.includes(this.file['type']))
        return URL.createObjectURL(this.file);
      }
      return null
    }
  },
  methods: {
    uploadFile(event) {
      this.file = event.target.files[0]
    },
    dragFile(event) {
      this.file = event.dataTransfer.files[0]
    },
    addTrait() {
      console.log(`trigger`)
      this.traits.push({
        trait: '',
        value: '',
      })
    },
  },
}
</script>
