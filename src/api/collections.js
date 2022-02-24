import axios, { getData } from '@/lib/axios'

export function getCollections(filter = {}) {
  return axios
    .get('v1/collectionSummary/list', {
      params: filter,
      headers: getAuthHeaders()
    })
    .then(getData)
}
export function getCollectionList() {
  return axios.get('/v1/collection/list?c=Web').then(getData)
}
export function getCollectionNames() {
  return axios.get('/v1/collection/names?c=Web').then(getData)
}
export function getFeaturedCollection(params) {
  return axios
  .get(
          `/v1/collectionViewed/getViewedCollection?c=Web&${new URLSearchParams(params).toString()}`, 
          {
            'Accept':'application/json'
          }
        )
    .then(getData)
}

export function getAssetPriceAlert() {
  return axios
    .get(`/v1/assetPriceAlert/priceList?c=Web`, 
      {
        headers: getAuthHeaders()
      }
      
    )
    .then(getData)
}

export function getAssetOfferReceived() {
  return axios
    .get(`/v1/assetListOffer/listReceived?c=Web`, {
      headers: getAuthHeaders()
    })
    .then(getData)
}

export function getAssetOfferMade() {
  return axios
    .get(`/v1/assetListOffer/listMade?c=Web`, {
      headers: getAuthHeaders()
    })
    .then(getData)
}
export function putAssetOfferList(assetListOfferId,payload) {
  return axios
    .put(`/v1/assetListOffer/${assetListOfferId}?c=Web`,
      payload, {
      headers: getAuthHeaders()
    })
    .then(getData)
}
export function putUnlistAsset(payload) {
  return axios
    .put(`/v1/asset/unlist?c=Web`,
      payload, {
      headers: getAuthHeaders()
    })
    .then(getData)
}
export function getAssetOwned(filter) {
  return axios
    .get(
      `/v1/assetList/listOwned?c=Web&listStatus=0&listStatus=2`,
      {
        headers: getAuthHeaders()
      },filter
    )
    .then(getData)
}

export function getCollection(collectionId) {
  return axios.get(`v1/collection/${collectionId}?c=Web`,{
    headers: getAuthHeaders(),
  }).then(getData)
}

export function getNFTCollection(params, payload) {
  return axios
    .post(
      `/v1/asset/list?c=Web&${new URLSearchParams(params).toString()}`,
      payload,
    )
    .then(getData)
}

export function getCollectionSortFilter() {
  return axios.get('/v1/static/assetSortByList?c=Web').then(getData)
}

export function getCollectionRecentSale(params) {
  return axios
    .get(
      `/v1/assetHistory/recentSale?c=Web&${new URLSearchParams(params).toString()}`, 
      {
        'Accept':'application/json'
      }
    )
    .then(getData)
}

export function getAttributes(collectionId) {
  return axios
    .get(`/v1/collection/${collectionId}/attributes?c=Web`)
    .then(getData)
}

export function getMarketplaceByCollection(collectionId) {
  return axios
    .get(`/v1/collection/${collectionId}/marketplaceSummaryList?c=Web`)
    .then(getData)
}

export function getAssetDetails(id) {
  return axios
    .get(`/v1/asset/${id}?c=Web`)
    .then(getData)
}
export function postListNFTs(payload) {
  return axios
    .post(`/v1/asset?c=Web`,
      payload, {
      headers: getAuthHeaders()
    })
    .then(getData)
}
export function postAssetListOffer(payload) {
  return axios
    .post(`/v1/assetListOffer?c=Web`,
      payload, {
      headers: getAuthHeaders()
    })
    .then(getData)
}
export function postLogin(payload) {
  return axios
    .post(
      `/v1/auth/login`,
      payload,
    )
    .then(getData)
}

export function postAssetPriceAlert(payload) {
  return axios
    .post(
      `/v1/assetPriceAlert?c=Web`,
      payload,
      {
        headers: getAuthHeaders()
      }
    )
    .then(getData)
}

export function logout() {
  return axios
    .get(
      `/v1/auth/logout`, {
      headers: getAuthHeaders(),
    })
    .then(getData)
}

function getAuthHeaders() {
  let token = localStorage.getItem("token") ? localStorage.getItem("token") : "";
  let header = {
      av: token,
      'Content-Type': 'text/plain'
  }
  return header;
}

export function getAssetActivities(filter) {
  return axios
    .get(
      `/v1/assetHistory/listOwned?c=Web`,
      
      {
        headers: getAuthHeaders()
      },filter
    )
    .then(getData)
}

export function getUserDetails() {
  return axios.get(`/v2/user?c=Web&cv=2.0`, {
    headers: getAuthHeaders(),'Accept':'application/text,text/plain'
  })
    .then(getData)
}

export function getUserAndUpdateDetails(payload) {
  return axios
    .put(
      `/v2/user?c=Web&cv=2.0`,
      payload, {
      headers: getAuthHeaders()
    })
    .then(getData)
}

export function getMarketPlaceDetails() {
  return axios.get(`/v1/collectionSummary/marketplacesOverview?c=Web`, {
    headers: getAuthHeaders(),'Accept':'application/text,text/plain'
  })
    .then(getData)
}

export function getPriceHistory(assetId) {
  return axios.get(`/v1/assetHistory/priceHistoryChart/${assetId}?c=Web`, {
     'Accept':'application/text,text/plain'
  })
    .then(getData)
}
export function postViewedCollectionId(payload) {
  return axios
    .post(`/v1/collectionViewed?c=Web&cv=1.0`,
      payload, {
      headers: getAuthHeaders()
    })
    .then(getData)
}

export function postUserCollectionWatched(payload) {
  return axios
    .post(
      `/v1/userCollectionWatched?c=Web&cv=1.0`,
      payload,{
        headers: getAuthHeaders()
      }
    )
    .then(getData)

}