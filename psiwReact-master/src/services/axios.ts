import axios from "axios"

export const instance = axios.create({
  // baseURL: 'https://jinxdah.shop:5587/api',
  baseURL: 'http://localhost:5587/api',
  timeout: 500000,
  
});