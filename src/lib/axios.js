import axios from 'axios'
const TOKEN = 'q6op9zpyfcn86g4hkin3o9flw47gzx76eohhtwog'

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL

//?c=Web
console.log(API_BASE_URL)
const request = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  },
})

request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      return Promise.reject(error.response)
    }
  },
)

export function getData(response) {
  return response.data
}

export default request
