import axios, { getData } from '@/lib/axios'

export function getSortCollectionOptions() {
  return axios.get('/v1/static/assetSortByList?c=Web').then(getData)
}

export function getSolanaExchangeRate() {
  return axios
    .get(
      'v1/static/getLatestCurrencyConversionRate?c=Web',
    )
    .then(getData)
}
