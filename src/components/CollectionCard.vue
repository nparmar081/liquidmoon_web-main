<template>
  <section>
    <router-link :to="`${collectionUrl}`">
      <div
        :style="{
          backgroundImage: `url(${image})`,
        }"
        class="h-32 w-full bg-cover bg-center rounded-t-md"
      ></div>
      <div class="p-4 bg-gray-800 rounded-b-md">
        <div class="flex items-center justify-between">
          <div class="truncate">
            <!-- <span class="text-primary">#{{ ranking }}</span> -->
            {{ name }}
          </div>
          <img v-if="verified" src="@/assets/icons/checkmark.svg" />
        </div>
        <div v-if="price" class="text-lg">{{ $filters.sol(price) }} SOL</div>
        <div v-if="listStatus" class="text-primary">{{ listStatus }}</div>
      </div>
    </router-link>
  </section>
</template>

<script>
export default {
  props: {
    // ranking: {
    //   type: [Number, String],
    //   required: true,
    // },
    // id: {
    //   type: Number,
    //   required: true,
    // },
    id: {
      required: false,
    },
    collectionId: {
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: false,
      default: false,
    },
    price: {
      type: Number,
      required: false,
      default: null,
    },
    mintaddress: {
      type: String,
      required: false,
      default: null,
    },
    userType: {
      type: String,
      required: false,
      default: null
    },
    listStatus: {
      type: String,
      required: false,
      default: null,
    },
    assetDetails: {
      type: Boolean,
      required: false,
      default: false,
    },
    isViewedCollection: {
      type: Boolean,
      required: false,
      default: false,
    },    
  },
computed: {
    collectionUrl() {
      var collectionId = ''
      if (this.collectionId != null) {
        if (typeof this.collectionId === 'object') {
          collectionId =  this.collectionId.id
        }
        collectionId = this.collectionId
      }
      if(this.isViewedCollection) {
        return '/collection/' + collectionId
      } else if(!this.assetDetails) {
        return '/collection/0/asset/'+this.mintaddress +'?userType='+this.userType
      } else {
        return '/collection/'+collectionId+'/asset/'+this.id
      }
    }
  },
};
</script>

<style></style>
