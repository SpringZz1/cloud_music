import axios from 'axios';

export const baseUrl = ' http://localhost:4000'; // api运行的端口

// axios的实例以及拦截器配置
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.log(err, '网络错误');
  }
);

export { axiosInstance };