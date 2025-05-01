import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

interface FetcherParams {
  url: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  data?: any
  params?: Record<string, any>
}

export const fetcher = async <T>({ url, method, data, params }: FetcherParams): Promise<T> => {
  try {
    const config: AxiosRequestConfig = { url, method, data, params }
    const response: AxiosResponse<T> = await api(config)
    return response.data
  } catch (error) {
    throw error
  }
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}
