// ============ TO USE LOGIN AND REGISTER ========== //
export type credentials = {
  username: string
  password?: string
}

export type authUsers = credentials & {
  id: string
  token?: string
  id_event?: string
}

export type authToken = string

export type loginType = { token: authToken; id_event: string }
