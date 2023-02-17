import { Router, Request } from 'express';
import { responseCasesType } from '../../../common/types.common';
import {
    authToken,
    authUsers,
    credentials,
    loginType
} from '../../../core/auth/credentials.auth';
import {
    contentMarketTrading,
    responseHistoryConnections,
    responseMarketTrading,
} from '../../../core/market/http_subscriber.markets';
import { responseError } from '../http_requests/types.http_request';

// ============== HTTP INTERFACES ================ //
export interface HttpRoutesInterface {
  router: Router
  index(): Router
}

export interface TypedRequestBody<T> extends Request {
  body: T
}

// ============== AUTH INTERFACES ================ //
export interface AuthCasesInterface {
  register(data: credentials): Promise<authUsers | boolean>
  login(data: credentials): Promise<loginType | boolean>
  logout(data: authToken): boolean
}

export interface AuthServicesInterface {
  register(data: credentials): Promise<responseCasesType>
  login(data: credentials): Promise<responseCasesType>
  logout(data: authToken): responseCasesType
}
// ============== MARKET INTERFACES ================ //
export interface MarketUseCasesInterface {
  get_market_trading(
    content: contentMarketTrading,
    user_id: string
  ): Promise<responseMarketTrading | responseError>
  get_history_trades(user_id: string): Promise<responseHistoryConnections | responseError>
  update_market_trading(tuser_id: string, trade_id: string): Promise<responseCasesType>
}

export type MarketServicesInterface = {
  get_market_trading(content: contentMarketTrading, user_id: string): Promise<responseCasesType>
  get_history_trades(user_id: string): Promise<responseCasesType>
  update_market_trading(tuser_id: string, trade_id: string): Promise<responseCasesType>
}
