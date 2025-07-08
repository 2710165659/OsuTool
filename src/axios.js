import axios from 'axios'

// 设置请求拦截器转发到Cloudflare Worker
axios.interceptors.request.use(config => {
    // 如果URL已经包含代理前缀，则不再处理
    if (config.url.includes('https://osu.xywork.top/cors?url=')) {
      return config
    }
    // 利用cloud flare worker解决cors
    config.url = `https://osu.xywork.top/cors?url=${encodeURIComponent(config.url)}`
    
    return config
  }, error => {
    return Promise.reject(error)
  })

// // 设置全局axios响应拦截器捕获异常
// axios.interceptors.response.use(
//     response => response,
//     error => {
//         // 可以在这里统一处理错误日志或弹窗
//         return Promise.reject(error);
//     }
// );

export { axios as myAxios };
