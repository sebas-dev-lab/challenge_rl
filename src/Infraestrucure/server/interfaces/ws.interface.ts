
export interface WsConnectionInterface {
  connect(): void
  disconnet(id: string): void
  set_server(server: any): void
  start(port: number): void
}
