import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../components/layouts/BaseLayout.vue"),
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("../views/Home.vue"),
      },
    ],
  },
  {
    path: "/*",
    component: () => import("../components/layouts/BaseLayout.vue"),
    children: [
      {
        path: "/collection/:id",
        name: "Collection",
        component: () => import("../views/Collection.vue"),
      },
    ],
  },
  {
    path: "/*",
    component: () => import("../components/layouts/BaseLayout.vue"),
    children: [
      {
        path: "/watchlist",
        name: "Watchlist",
        component: () => import("../views/WatchList.vue"),
      },
      {
        path: "/collection/:id/asset/:assetId",
        name: "Asset",
        component: () => import("../views/Asset.vue"),
      },
      // {
      //   path: '/collection/:id/asset/:assetId',
      //   name: 'Asset',
      //   component: () => import('../views/Asset.vue'),
      // },
      {
        path: "/me",
        name: "UserProfile",
        component: () => import("../views/UserProfile.vue"),
      },
      {
        path: "/me/edit",
        name: "UserProfileEdit",
        component: () => import("../views/UserProfile/EditUserProfile.vue"),
      },
      {
        path: "/sell",
        name: "Sell NFT",
        component: () => import("../views/SellNft.vue"),
      },
    ],
  },
  {
    path: "/comingsoon",
    name: "ComingSoon",
    component: () => import("../views/ComingSoon.vue"),
  },
];

const router = createRouter({
  mode: "hash",
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export default router;
