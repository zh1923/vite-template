import axios from "axios";
import { message } from "ant-design-vue";
import type { Protocols } from "@micros-common-vue/type";
import type { AxiosRequestConfig } from "axios";
import { UserUtil } from "@micros-common-vue/util";

axios.defaults.baseURL = ""; //正式
// axios.defaults.baseURL = 'http://test' //测试

// POST 请求头
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

//设置超时
axios.defaults.timeout = 10000;

axios.interceptors.request.use((config) => headerInterceptor(config));

/**
 * 请求头拦截
 */
const headerInterceptor = async (config: AxiosRequestConfig) => {
  const { headers: optionsHeaders, ...restOptions } = config || {};
  const loginInfo = await UserUtil.getLoginInfo<any>();
  return {
    ...restOptions,
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      // 'Content-Type': 'multipart/form-data'
      Accept: "application/json",
      Authorization: loginInfo?.access_token
        ? `${loginInfo?.token_type} ${loginInfo?.access_token}`
        : "(no access token)",
      ...(optionsHeaders || {}),
    },
  } as AxiosRequestConfig;
};

axios.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return Promise.resolve(response);
    }
  },
  // 服务器状态码不是200的情况
  (error) => {
    if (error.response.status) {
      switch (error.response.status) {
        case 404:
          message.warning("接口不存在，请刷新重试或联系管理员");
          break;
        case 401:
          break;
        case 500:
          message.error("服务异常，请稍后刷新重试或联系管理员");
          break;
        case 502:
          message.error("服务异常，请稍后刷新重试或联系管理员");
          break;
        default:
          error.response.data?.message
            ? message.error(error.response.data.message)
            : "";
          return Promise.reject(error.response);
      }
    }
  }
);
export default {
  post<T>(url: string, data?: any, headers?: any, params?: any) {
    return new Promise<Protocols.RepData>((resolve, reject) => {
      axios({
        method: "post",
        url: "/api" + url,
        data,
        headers,
        params,
      })
        .then((res) => {
          if (res && res.data && res.data.success) {
            resolve(res.data as T);
          } else if (res && res.data && !res.data.success) {
            res.data.message ? message.error(res.data.message) : "";
            reject();
          } else {
            reject();
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  get<T>(url: string, data?: any, headers?: any) {
    return new Promise<Protocols.RepData>((resolve, reject) => {
      axios({
        method: "get",
        url: "/api" + url,
        params: data ?? {},
        headers,
      })
        .then((res) => {
          if (res && res.data && res.data.success) {
            resolve(res.data as T);
          } else if (res && res.data && !res.data.success) {
            res.data.message ? message.error(res.data.message) : "";
            reject();
          } else {
            reject();
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  other<T>(
    url: string,
    method: "put" | "delete",
    data?: any,
    params?: any,
    headers?: any
  ) {
    return new Promise<Protocols.RepData>((resolve, reject) => {
      axios({
        method: method,
        url: "/api" + url,
        data,
        params,
        headers,
      })
        .then((res) => {
          if (res && res.data && res.data.success) {
            resolve(res.data as T);
          } else if (res && res.data && !res.data.success) {
            res.data.message ? message.error(res.data.message) : "";
            reject();
          } else {
            reject();
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
