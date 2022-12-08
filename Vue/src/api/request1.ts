import router from "@/router";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  CancelTokenStatic,
  Canceler,
} from "axios";
// import qs from "qs";

export interface CustomResponse {
  status?: string;
  command?: string;
  message?: string;
  result?: any;
}

export class Request {
  protected instance: AxiosInstance;

  protected pending: Array<{
    url: string;
    cancel: Canceler;
  }> = [];

  protected CancelToken: CancelTokenStatic = axios.CancelToken;

  protected axiosRequestConfig: AxiosRequestConfig = {};

  protected successCode = [200, 201, 204];

  protected baseURL = "";

  constructor(baseURL?: string) {
    this.baseURL = baseURL || this.baseURL;
    this.requestConfig();
    this.instance = axios.create(this.axiosRequestConfig);
    this.interceptorsRequest();
    this.interceptorsResponse();
  }

  async get<T>(
    url: string,
    params?: T,
    config?: AxiosRequestConfig
  ): Promise<CustomResponse> {
    const data: CustomResponse = await this.instance.get(url, {
      params,
      ...config,
    });
    return data;
  }

  async post<T>(
    url: string,
    data?: T,
    params?: T,
    config?: AxiosRequestConfig
  ): Promise<CustomResponse> {
    const res: CustomResponse = await this.instance.post(url, data, {
      params,
      ...config,
    });
    return res;
  }

  async delete<T>(
    url: string,
    data?: T,
    params?: T,
    config?: AxiosRequestConfig
  ): Promise<CustomResponse> {
    const res: CustomResponse = await this.instance.delete(url, {
      data,
      params,
      ...config,
    });
    return res;
  }

  async patch<T>(
    url: string,
    data?: T,
    params?: T,
    config?: AxiosRequestConfig
  ): Promise<CustomResponse> {
    const res: CustomResponse = await this.instance.patch(url, data, {
      params,
      ...config,
    });
    return res;
  }

  // axios请求配置
  protected requestConfig(): void {
    this.axiosRequestConfig = {
      baseURL: this.baseURL,
      headers: {
        // timestamp: String(new Date().getTime()),
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      // transformRequest: [(obj) => qs.stringify(obj)],
      transformRequest: [
        (data: CustomResponse) => {
          return data;
        },
      ],
      transformResponse: [
        (data: AxiosResponse) => {
          return data;
        },
      ],
      // paramsSerializer(params: any) {
      //   return qs.stringify(params, { arrayFormat: "brackets" });
      // },
      timeout: 30000,
      withCredentials: false,
      responseType: "json",
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      maxRedirects: 5,
      maxContentLength: 2000,
      validateStatus(status: number) {
        return status >= 200 && status < 500;
      },
    };
  }

  // 请求拦截
  protected interceptorsRequest(): void {
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        this.removePending(config);
        config.cancelToken = new this.CancelToken((c: Canceler) => {
          this.pending.push({
            url: `${config.url}/${JSON.stringify(config.data)}&request_type=${
              config.method
            }`,
            cancel: c,
          });
        });
        // const token = store.getters["userModule/getToken"];
        // if (token) {
        //   Object.assign(config.headers, { "x-token": token || "" });
        // }
        this.requestLog(config);
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
  }

  // 响应拦截
  protected interceptorsResponse(): void {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        this.responseLog(response);
        this.removePending(response.config);
        if (this.successCode.indexOf(response.status) === -1) {
          return Promise.reject(new Error(response.data || "Error"));
        }
        response.data = JSON.parse(response.data);
        return response.data;
      },
      (err: AxiosError) => {
        if (err && err.response) {
          const response = err.response;
          switch (response.status) {
            case 400:
              err.message = "请求参数错误";
              break;
            case 401:
            case 403:
              err.message = "身份已过期，请重新登录！";
              router.push({ path: "/" });
              break;
            case 404:
              err.message = "请求地址出错";
              break;
            case 408:
              err.message = "请求超时";
              break;
            case 500:
              err.message = "服务器内部错误";
              break;
            case 501:
              err.message = "服务未实现";
              break;
            case 502:
              err.message = "网关错误";
              break;
            case 503:
              err.message = "服务不可用";
              break;
            case 504:
              err.message = "网关超时";
              break;
            case 505:
              err.message = "HTTP版本不受支持";
              break;
            default: {
              err.message = "未定义错误";
              break;
            }
          }
        } else {
          //   errorMsg("未知错误");
        }
        return Promise.reject(err);
      }
    );
  }

  // 取消重复请求
  protected removePending(config: AxiosRequestConfig): void {
    this.pending.map((v, index) => {
      if (
        v.url ===
        `${config.url}/${JSON.stringify(config.data)}&request_type=${
          config.method
        }`
      ) {
        v.cancel();
        this.pending.splice(index, 1);
      }
      return v;
    });
  }

  // 请求日志
  protected requestLog(request: AxiosRequestConfig): void {
    // if (process.env.NODE_ENV === "development") {
    // }
  }

  // 响应日志
  protected responseLog(response: AxiosResponse): void {
    // if (process.env.NODE_ENV === "development") {
    // }
  }
}

export default new Request();
