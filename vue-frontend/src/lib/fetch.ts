import axios from 'axios'

const backend_url = import.meta.env.BACKEND_URL || 'https://3000.tzgyn.com'

export const customAxios = axios.create({
    baseURL: backend_url
})
