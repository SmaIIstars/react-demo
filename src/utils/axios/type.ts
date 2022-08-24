import { AxiosRequestConfig, AxiosResponse } from 'axios';

// 实例拦截器
export interface RequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorCatch?: (err: any) => any;
  responseInterceptor?: (config: T) => T;
  responseInterceptorCatch?: (err: any) => any;
}

export interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: RequestInterceptors<T>;
  spinLoading?: boolean;
}
