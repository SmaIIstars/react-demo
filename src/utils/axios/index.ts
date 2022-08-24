import BaseRequest from "./request";
import { TIME_OUT, INSTANCE_INTERCEPTORS } from "./config";

const defaultAxiosRequestConfig = {
  timeout: TIME_OUT,
};

// 若有多个baseURL,新建实例
// 请求实例
const blogRequest = new BaseRequest({
  ...defaultAxiosRequestConfig,
  baseURL: "/blogApi",
  interceptors: INSTANCE_INTERCEPTORS,
});

export { blogRequest };
