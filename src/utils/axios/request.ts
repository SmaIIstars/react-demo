import axios from 'axios';
// type
import { AxiosInstance } from 'axios';
import { RequestInterceptors, RequestConfig } from './type';
import { GLOBAL_INTERCEPTORS } from './config';

class BaseRequest {
  instance: AxiosInstance;
  interceptors?: RequestInterceptors;

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);

    // 全局拦截器
    this.instance.interceptors.request.use(
      GLOBAL_INTERCEPTORS.REQUEST_INTERCEPTOR,
      GLOBAL_INTERCEPTORS.REQUEST_INTERCEPTOR_CATCH
    );
    this.instance.interceptors.response.use(
      GLOBAL_INTERCEPTORS.RESPONSE_INTERCEPTOR,
      GLOBAL_INTERCEPTORS.RESPONSE_INTERCEPTOR_CATCH
    );

    // 实例拦截器
    this.interceptors = config.interceptors;
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );
  }

  request<T>(config: RequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 单独请求拦截器
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }
      // 发起请求
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 单独响应拦截器
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get<T>(config: RequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' });
  }

  post<T>(config: RequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' });
  }

  delete<T>(config: RequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' });
  }

  patch<T>(config: RequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' });
  }
}

export default BaseRequest;
