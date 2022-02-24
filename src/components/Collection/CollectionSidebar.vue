<template>
  <div class="sticky top-0 ">
    <div
      class="flex justify-between items-center p-3 bg-gray-800 cursor-pointer">
      <span class="flex items-center">
        <img
          src="@/assets/icons/list.svg"
          class="mr-3 w-5 h-5">
        Filters
      </span>
      <img
        src="@/assets/icons/arrow-left.svg"
        class="w-5 h-5"
        @click="toggleSidebar">
    </div>
    <sidebar-accordian
      title="Marketplaces"
      icon
      :default-open="false">
      <base-checkbox
        v-for="(marketplace, index) in marketplaces"
        :key="index"
        v-model="selectedMarketplace"
        :disabled="marketplace.count < 1"
        class="mr-4 mb-2"
        :value="marketplace.label">
        {{ marketplace.label }} ({{ marketplace.count }})
      </base-checkbox>
    </sidebar-accordian>
    <sidebar-accordian
      title="Price Filter (SOL)"
      icon
      :default-open="true">
      <div
        v-if="filter"
        class="flex items-center mb-4 space-x-4">
        <base-input
          v-model="pricesFilter.minPrice"
          placeholder="Min"
          type="number"
          :min="0" />
        <span>to</span>
        <base-input
          v-model="pricesFilter.maxPrice"
          placeholder="Max"
          type="number" />
      </div>
      <l-button
        class="py-2 w-full font-mono text-center"
        @click="updatePriceFilter">
        Apply
      </l-button>
    </sidebar-accordian>
    <sidebar-accordian
      v-if="attributes.length > 0"
      title="Attributes Filter"
      icon
      :default-open="true">
      <Listbox
        v-for="attribute in attributes"
        :key="attribute.traitType"
        as="div">
        <div class="relative mt-1">
          <ListboxButton
            class="relative py-2 pr-10 pl-3 w-full text-left text-gray-400 bg-black rounded-md border border-secondary focus:outline-none focus:ring-1 shadow-sm cursor-default sm:text-sm focus:ring-primary-500 focus:border-primary-500">
            <span
              v-if="attribute.selected.length > 0"
              class="block text-gray-400 capitalize truncate">
              <span
                v-for="(label, index) in attribute.selected"
                :key="index">
                {{ label }}
                <span v-if="index !== attribute.selected.length - 1">,</span>
              </span>
            </span>
            <span
              v-else
              class="block font-mono truncate">
              {{ attribute.traitType || 'Extension' }}
            </span>
            <span
              class="flex absolute inset-y-0 right-0 items-center pr-2 pointer-events-none">
              <SelectorIcon
                class="w-5 h-5 text-gray-400"
                aria-hidden="true" />
            </span>
          </ListboxButton>

          <transition
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <ListboxOptions
              class="overflow-auto absolute z-10 py-1 mt-1 w-full max-h-60 text-base bg-black rounded-md focus:outline-none ring-1 ring-black ring-opacity-5 shadow-lg sm:text-sm">
              <ListboxOption
                v-for="option in attribute.traits"
                :key="option.value"
                v-slot="{ active, selected }"
                as="template"
                :value="option">
                <li
                  class="relative py-2 px-3 text-gray-400 hover:text-white hover:bg-secondary cursor-default select-none"
                  :class="[
                    attribute.selected.includes(option.trait) && 'bg-secondary',
                  ]"
                  @click="selectAttribute(attribute.traitType, option.trait)">
                  <span
                    class="flex justify-between items-center cursor-pointer"
                    :class="[
                      selected ? 'font-semibold' : 'font-normal',
                      'block truncate',
                    ]">
                    <span class="capitalize">
                      {{ option.trait }} ({{ option.count }})
                    </span>
                    <span>floor: {{ $filters.crypto(option.floorPrice) }}</span>
                  </span>

                  <span
                    v-if="selected"
                    :class="[
                      active ? 'text-white' : 'text-indigo-600',
                      'absolute inset-y-0 right-0 flex items-center pr-4',
                    ]">
                    <CheckIcon
                      class="w-5 h-5"
                      aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
    </sidebar-accordian>
  </div>
</template>

<script>
import {
  getAttributes,
  getMarketplaceByCollection,
  postViewedCollectionId,
} from '../../api/collections'

import SidebarAccordian from '../shared/SidebarAccordian.vue'
import BaseCheckbox from '../shared/BaseCheckbox.vue'
import BaseInput from '../shared/BaseInput.vue'
// import BaseSelectDialog from '../shared/BaseSelectDialog.vue'
// import BaseSelectDialogItem from '../shared/BaseSelectDialogItem.vue'
import LButton from '../shared/LButton.vue'

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'

export default {
  components: {
    SidebarAccordian,
    BaseCheckbox,
    BaseInput,
    LButton,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    CheckIcon,
    SelectorIcon,
  },
  props: {
    collectionId: {
      type: String,
      required: true,
    },
    filter: {
      type: Object,
      default: () => ({
        minPrice: 0,
        maxPrice: 0,
      }),
    }
  },
  data: () => ({
    marketplaces: [],
    selectedMarketplace: [],
    attributes: [],
    selectedAttributes: [],
    pricesFilter: {
      minPrice: null,
      maxPrice: null,
    }
  }),
  computed: {
    formattedPricesFilter() {
      return {
        minPrice: Number(this.pricesFilter.minPrice),
        maxPrice: Number(this.pricesFilter.maxPrice),
      }
    },
  },
  watch: {
    selectedMarketplace() {
      this.updateMarketplaceFilter()
    },
    attributes() {
      if(sessionStorage.getItem("attributes")) {
        let attributes = JSON.parse(sessionStorage.getItem("attributes"));
        this.attributes = attributes;
        this.$emit('update-attributes-filter', attributes)
      }
    }
  },
  mounted() {
    getAttributes(this.collectionId)
      .then((response) => {
        const { data } = response
        this.attributes = data.map((attribute) => {
          return {
            ...attribute,
            selected: [],
          }
        })
        return getMarketplaceByCollection(this.collectionId)
      })
      .then((response) => {
        const { data } = response
        this.marketplaces = data
      })

      if(this.$store.getters.isWalletConnected){
          var payload = {}
          payload["collection"] = {
            id: this.collectionId,
          };
          postViewedCollectionId(payload);
      }
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    },
    updatePriceFilter() {
      this.$emit('update-price-filter', this.formattedPricesFilter)
    },
    updateMarketplaceFilter() {

      this.$emit('update-marketplace-filter', this.selectedMarketplace)
    },
    selectAttribute(traitType, trait) {
      this.attributes.forEach((attribute) => {
        if (attribute.traitType !== traitType) return
        if (attribute.selected.includes(trait)) {
          attribute.selected = attribute.selected.filter(
            (item) => item !== trait,
          )
        } else {
          attribute.selected.push(trait)
        }
      })
      sessionStorage.setItem("attributes", JSON.stringify(this.attributes))
      this.$emit('update-attributes-filter', this.attributes)
    },
  },
}
</script>

<style></style>
