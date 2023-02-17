export type responseType = {
  status: number | string
  isValid: boolean
  data?: any
}

export type responseError = {
  status: number
  error: boolean
  message: string
}

export type requestFetch = {
  url: string
  method: string
  body?: { [key: string]: any }
  params?: string
  query?: string
  headers?: { [key: string]: any }
}
