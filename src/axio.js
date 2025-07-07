import axios from 'axios';

// 设置全局axios响应拦截器捕获异常
axios.interceptors.response.use(
    response => response,
    error => {
        // 可以在这里统一处理错误日志或弹窗
        return Promise.reject(error);
    }
);

export { axios as myAxios };
