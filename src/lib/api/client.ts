import axios from 'axios';
import type { AxiosError } from 'axios';
import { getAccessToken } from "@/lib/auth/oidc-config";

export const BASE_URL = "https://preview-rls09.congacloud.com";

export function clientWithToken(token: string) {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 30_000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status ?? 'unknown';
      const data = error.response?.data as
        | { Errors?: Array<{ Message: string }> }
        | undefined;
      const message = data?.Errors?.[0]?.Message ?? error.message;
      return Promise.reject(new Error(`[${status}] ${message}`));
    },
  );

  return client;
}

export function apiClient() {
  return clientWithToken(getAccessToken());
}
