import axios from 'axios'

const network = axios.create({
  baseURL: process.env.API_URL,
})

export default network
