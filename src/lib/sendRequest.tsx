import { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios'
type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

interface SendRequestParams {
    data?: AxiosRequestConfig['data']
    endpoint: string,
    headers?:  AxiosRequestConfig['headers'];
    method: HttpMethod
  }

export const sendRequest = async ({data, headers, endpoint, method}:SendRequestParams) => { 

    try{
        const response = await httpClient(`${endpoint}`, {
            data,
            headers,
            method,
          })

          return {
            data: response.data,
            error: false,
            headers:response.headers,
            message: response.data.message,
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            return { error: true, message: error.response?.data.message }
          }
      
          return { error: true, message: 'Erro desconhecido' }
    }
}

export const httpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
  })