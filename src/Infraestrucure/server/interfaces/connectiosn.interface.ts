import { HttpConnectionInterface } from './http.interfaces';
import { WsConnectionInterface } from './ws.interface';

export interface MainConnectionInterface {
  conn_http: HttpConnectionInterface | undefined
  conn_ws: WsConnectionInterface | undefined
  combine: boolean
  _port: number
  ws_options: any | undefined
  http_options: any | undefined
  main_start(): void
}
