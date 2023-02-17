import { WebSocket } from 'ws';
import { subscribers } from '../market/ws_subscriber.market';

export enum typeAuthContext {
  'private' = 'private',
  'public' = 'public'
}

export enum contextAuth {
  'reg' = 'register',
  'login' = 'signin',
  'logout' = 'signout',
  'onsession' = 'onsession'
}

export enum contexts {
  'auth' = 'auth.context',
  'ws_conn' = 'connection.context',
  'pub_ws_conn' = 'pub_connection.context',
  'historical' = 'auth.historical'
}

export type ws_connection = {
  connection: WebSocket
  date: Date
  _creds: {
    id_event: string
    id_conn: string
    online: boolean
  }
  subscribers?: Array<subscribers>
}
