import axios from 'axios'

const api = axios.create({
  baseURL: 'http://175.45.200.75:9090', 
  withCredentials: true,  // 이게 들어가면 백단에 .allowCredentials(true); 필요
})

// ✅ 요청 시 Access Token 자동 삽입
api.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('jwt-atk')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
}, error => Promise.reject(error))

export default api
