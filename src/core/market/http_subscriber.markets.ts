import { ws_connection } from '../auth/context.auth';

export enum tradingType {
  'buy' = 'buy',
  'sell' = 'sell'
}

export type responseMarketTrading = {
  amount: number
  price: number
  operation: tradingType
}

export type contentMarketTrading = {
  amount: number
  symbol: string
  operation: tradingType
}

export type responseHistoryConnections = Array<ws_connection>

export type orderBookBtfReq = {
  amount: number
  price: number
  timestamp: Date
}

export enum orderCondition {
  'open' = 'open',
  'pending' = 'pending',
  'close' = 'close'
}

export type tradeOperation = {
  _id: string
  condition: orderCondition
  symbol: string
  amount: number
  price: number
  operation: string
  time: Date
  close_time?: Date
  result?: number
}
