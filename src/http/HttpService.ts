import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { IHttpClient } from './IHttpClient';

import { isTokenValid } from '@/lib/auth';

const REFRESH_TOKEN_URL = '/auth/refresh_token';

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Shared across every HttpService instance so that concurrent requests trigger
// at most one refresh call and all wait on the same result.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    // Lazy import avoids a circular dependency (AuthHttpService extends HttpService).
    refreshPromise = import('@/features/login/http/AuthHttpService')
      .then(({ authServiceHttpServiceInstance }) => authServiceHttpServiceInstance.refreshToken())
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

function handleRefreshFailure() {
  localStorage.removeItem('token');
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

export class HttpService implements IHttpClient {
  private readonly client: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      headers: {
        ...config?.headers,
      },
      ...config,
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<{ message?: string }>) => {
        const originalRequest = error.config as RetriableRequestConfig | undefined;
        const isRefreshCall = originalRequest?.url?.includes(REFRESH_TOKEN_URL);

        // The token was rejected by the backend: refresh once and replay the request.
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !isRefreshCall
        ) {
          originalRequest._retry = true;
          try {
            const token = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            handleRefreshFailure();
            return Promise.reject(refreshError);
          }
        }

        if (error.response?.data?.message) {
          return Promise.reject(new Error(error.response.data.message));
        }
        return Promise.reject(error);
      },
    );

    this.client.interceptors.request.use(async (config) => {
      let token = localStorage.getItem('token');
      const isRefreshCall = config.url?.includes(REFRESH_TOKEN_URL);

      // The frontend recognizes the token has expired (via its JWT exp claim) and
      // refreshes it before the request goes out. The refresh call itself is skipped
      // so it can still send the expired token the backend expects.
      if (token && !isRefreshCall && !isTokenValid(token)) {
        try {
          token = await refreshAccessToken();
        } catch {
          handleRefreshFailure();
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T = unknown, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = unknown, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  async patch<T = unknown, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.request(config);
    return response.data;
  }
}

export const httpService = new HttpService();
