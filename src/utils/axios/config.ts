// 基本配置
const TIME_OUT: number = 10000;

// 拦截器
// 全局拦截器
const GLOBAL_INTERCEPTORS = {
  REQUEST_INTERCEPTOR: (config: any) => {
    return config;
  },

  REQUEST_INTERCEPTOR_CATCH: (err: any) => {
    return err;
  },

  RESPONSE_INTERCEPTOR: (res: any) => {
    return res;
  },

  RESPONSE_INTERCEPTOR_CATCH: (err: any) => {
    return err;
  },
};

// 实例拦截器
const INSTANCE_INTERCEPTORS = {
  requestInterceptor: (config: any) => {
    return config;
  },

  requestInterceptorCatch: (err: any) => {
    return err;
  },

  responseInterceptor: (res: any) => {
    return res;
  },

  responseInterceptorCatch: (err: any) => {
    return err;
  },
};

export { TIME_OUT, INSTANCE_INTERCEPTORS, GLOBAL_INTERCEPTORS };
