import { useQuery, useMutation } from "@tanstack/react-query";

interface UseApiOptions {
  token?: string; // token opcional para rutas protegidas
  baseUrl?: string; // url base del backend
}

const buildHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

async function apiRequest<T>(
  url: string,
  method: string,
  body?: any,
  token?: string
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: buildHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Error en la petición: ${res.status}`);
  }

  return res.json();
}

export function useApi({ token, baseUrl = "" }: UseApiOptions) {
  const useGet = <T = any>(key: any[], url: string, options?: any) =>
    useQuery<T>({
      queryKey: key,
      queryFn: () => apiRequest<T>(baseUrl + url, "GET", undefined, token),
      ...options,
    });

  const usePost = <T = any>(url: string, options?: any) =>
    useMutation<T, Error, any>({
      mutationFn: (body: any) =>
        apiRequest<T>(baseUrl + url, "POST", body, token),
      ...options,
    });

  const usePut = <T = any>(url: string, options?: any) =>
    useMutation<T, Error, any>({
      mutationFn: (body: any) =>
        apiRequest<T>(baseUrl + url, "PUT", body, token),
      ...options,
    });

  const usePatch = <T = any>(url: string, options?: any) =>
    useMutation<T, Error, any>({
      mutationFn: (body: any) =>
        apiRequest<T>(baseUrl + url, "PATCH", body, token),
      ...options,
    });

  const useRemove = <T = any>(url: string, options?: any) =>
    useMutation<T, Error, any>({
      mutationFn: () =>
        apiRequest<T>(baseUrl + url, "DELETE", undefined, token),
      ...options,
    });

  return { useGet, usePost, usePut, usePatch, useRemove };
}
