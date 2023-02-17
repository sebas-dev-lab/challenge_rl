export type contextStore = { [key: string]: Array<any> }

export interface ContextInterface {
  store: contextStore
  context_id: string

  get_context_id(): string
  get_all_store: () => contextStore
  get_store_by_key: (key: string) => Array<any>
  get_store_key_size: (key: string) => number
  set_store: (data: contextStore) => void
  update_store: (key: string, data: Array<any>) => void
}
