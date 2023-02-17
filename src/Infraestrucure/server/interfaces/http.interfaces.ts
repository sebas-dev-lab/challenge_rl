import { Express } from 'express';
import { responseCasesType } from '../../../common/types.common';
import {
    contentMarketTrading,
    tradeOperation
} from '../../../core/market/http_subscriber.markets';
import { requestFetch, responseType } from '../http_requests/types.http_request';

export interface ConfigConnectionInterface {
  routes: any
  path: string
  middlewares(): void
}

export interface HttpConnectionInterface extends ConfigConnectionInterface {
  get_server(): Express
  start(port: number): void
}

export interface HttpSubscriptionsInterface {
  fetch: (arg: any) => Promise<responseType>
  baseUrl: requestFetch
  get_market_trading(content: contentMarketTrading, user_id: string): Promise<responseCasesType>
  get_history_trades(user_id: string): Promise<responseCasesType>
  update_market_trading(user_id: string, trade_id: string): Promise<responseCasesType>
}
