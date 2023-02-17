import { contexts } from '../../core/auth/context.auth';
import {
    orderCondition,
    tradeOperation
} from '../../core/market/http_subscriber.markets';

export class HistoricalMarkets {
    private context = contexts.historical;
    private user_id!: string;

    constructor(usid: string) {
        this.user_id = usid;
    }

    set_trader_historical(data: tradeOperation): void {
        if (!commonContext[this.context]) {
            throw new Error('Something was wrong!');
        }
        commonContext[this.context].set_store({
            [this.user_id]: !commonContext[this.context].get_store_by_key(this.user_id)
                ? [data]
                : commonContext[this.context].get_store_by_key(this.user_id).concat([data])
        });
    }

    update_condition_trade_historical(
        id: string,
        orderCondition: orderCondition,
        trade?: tradeOperation
    ): void {
        if (!commonContext[this.context]) {
            throw new Error('Something was wrong!');
        }
        commonContext[this.context].set_store({
            [this.user_id]: commonContext[this.context]
                .get_store_by_key(this.user_id)
                .map((x: tradeOperation) => {
                    if (x._id === id) {
                        if (trade) {
                            x = trade;
                            return x;
                        } else {
                            x.condition = orderCondition;
                            x.close_time = new Date();
                            x.result;
                            return x;
                        }
                    }
                    return x;
                })
        });
    }

    get_trade_by_id(user_id: string, trade_id: string): tradeOperation {
        return commonContext[this.context]
            .get_store_by_key(user_id)
            .find((x: tradeOperation) => x._id === trade_id);
    }

    get_trade_historical_by_id(user_id: string): Array<tradeOperation> {
        return commonContext[this.context].get_store_by_key(user_id);
    }
}
