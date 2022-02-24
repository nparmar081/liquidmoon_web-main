import axios, { getData } from '@/lib/axios'

/**
 * LOGIN
 */
export function login(payload) {
    return axios
        .post(`/v1/auth/login`,
            payload,
        )
        .then(getData)
}