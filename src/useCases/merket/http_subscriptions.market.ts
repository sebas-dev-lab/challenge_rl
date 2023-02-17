/* eslint-disable @typescript-eslint/no-unused-vars */
import { responseCasesType } from '../../common/types.common';
import {
    contentMarketTrading,
    orderBookBtfReq,
    orderCondition,
    tradeOperation,
    tradingType
} from '../../core/market/http_subscriber.markets';
import { Fetch } from '../../Infraestrucure/decorators/fetch.decorators';
import { useCases } from '../../Infraestrucure/server/envs/envs';
import {
    requestFetch,
    responseType
} from '../../Infraestrucure/server/http_requests/types.http_request';
import { HttpSubscriptionsInterface } from '../../Infraestrucure/server/interfaces/http.interfaces';
import { executeOrder } from './utils.market';
import { v4 as uuidv4 } from 'uuid';
import { HistoricalMarkets } from './historical_repository.market';

@Fetch(useCases.market_http)
export default class HttpSubscriptions implements HttpSubscriptionsInterface {
    fetch!: (arg: any) => Promise<responseType>;
    baseUrl!: requestFetch;

    async get_market_trading(
        content: contentMarketTrading,
        user_id: string
    ): Promise<responseCasesType> {
        try {
            // ================== CONTROL CONTENT POINT ============== //
            if (!content.amount || !content.symbol || !content.operation) {
                return {
                    code: 400,
                    error: true,
                    message: 'Invalid data.'
                };
            }

            if (content.operation !== tradingType.buy) {
                if (content.operation !== tradingType.sell) {
                    return {
                        code: 400,
                        error: true,
                        message: 'Invalid Operation!'
                    };
                }
            }
            // ================== GET ORDER BOOK TO CALCULATE AVG PRICE TO BE EXECUTE ORDER ============== //

            const getData = await this.fetch({
                url: this.baseUrl,
                method: 'GET',
                params: useCases.market_http_mk_avg_price + `/${content.symbol.toLowerCase()}`,
                query: 'limit_asks=1000&limit_bids=1000'
            });

            if (!getData.isValid) {
                throw new Error();
            }
            // ================== ESTIMATE PRICE TO EXECUTION OF MARKET ORDER ============== //
            let base_data: Array<orderBookBtfReq>;

            if (content.operation.toLowerCase() === tradingType.buy) {
                base_data = getData.data.asks;
            } else if (content.operation.toLowerCase() === tradingType.sell) {
                base_data = getData.data.bids;
            } else {
                throw new Error('Invalid Operation!');
            }

            const market_price = executeOrder(base_data, content.amount);
            // ========================= REGISTER TRADE OPERATION INTO HISTORICAL CONTEXT ======= //
            const register = new HistoricalMarkets(user_id);
            const newOrder: tradeOperation = {
                _id: uuidv4(),
                condition: orderCondition.open,
                symbol: content.symbol.toUpperCase(),
                amount: content.amount,
                price: market_price?.price,
                operation: content.operation,
                time: new Date()
            };
            register.set_trader_historical(newOrder);

            return {
                code: 200,
                error: false,
                data: newOrder
            };
        } catch (e: any) {
            return {
                code: 409,
                error: true,
                message: 'Something was wrong!'
            };
        }
    }

    async update_market_trading(user_id: string, trade_id: string): Promise<responseCasesType> {
        try {
            const register = new HistoricalMarkets(user_id);

            const trade = register.get_trade_by_id(user_id, trade_id);

            if (!trade) {
                throw new Error('Trade does not exists');
            }
            // ================== GET ORDER BOOK TO CALCULATE AVG PRICE TO BE EXECUTE ORDER ============== //

            const getData = await this.fetch({
                url: this.baseUrl,
                method: 'GET',
                params: useCases.market_http_mk_avg_price + `/${trade.symbol.toLowerCase()}`,
                query: 'limit_asks=1000&limit_bids=1000'
            });

            if (!getData.isValid) {
                throw new Error();
            }
            // ================== ESTIMATE PRICE TO EXECUTION OF MARKET ORDER ============== //
            let base_data: Array<orderBookBtfReq>;

            if (trade.operation.toLowerCase() === tradingType.buy) {
                base_data = getData.data.bids;
            } else if (trade.operation.toLowerCase() === tradingType.sell) {
                base_data = getData.data.asks;
            } else {
                throw new Error('Invalid Operation!');
            }

            if (!getData.isValid) {
                throw new Error();
            }

            const market_price = executeOrder(base_data, trade.amount);
            const updateOrder: tradeOperation = {
                ...trade,
                result: trade.price - market_price.price,
                condition: orderCondition.close,
                close_time: new Date()
            };
            register.update_condition_trade_historical(trade_id, orderCondition.close, updateOrder);

            return {
                code: 200,
                error: false,
                data: updateOrder
            };
        } catch (e: any) {
            return {
                code: 409,
                error: true,
                message: 'Something was wrong!'
            };
        }
    }

    async get_history_trades(user_id: string): Promise<responseCasesType> {
        try {
            const register = new HistoricalMarkets(user_id);

            return {
                code: 200,
                error: false,
                data: register.get_trade_historical_by_id(user_id)
            };
        } catch (e: any) {
            return {
                code: 409,
                error: true,
                message: 'Something was wrong!'
            };
        }
    }
}
