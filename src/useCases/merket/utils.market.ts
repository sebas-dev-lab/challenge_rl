import { v4 as uuidv4 } from 'uuid';
import { orderBookBtfReq } from '../../core/market/http_subscriber.markets';
import { eventSubscribers, subscribers } from '../../core/market/ws_subscriber.market';

export function create_subscriber(
    channel: string,
    { key, pair }: { key?: string; pair?: string }
): subscribers {
    return {
        _id: uuidv4(),
        active: true,
        channel,
        date: new Date(),
        event: eventSubscribers.subscribe,
        targes: {
            key,
            pair
        }
    };
}

export function executeOrder(
    base_data: Array<orderBookBtfReq>,
    amount: number
): { amount: number; price: number } | never {
    let n = amount;
    let idx = 0;
    let price_avg = 0;
    while (n > 0) {
        if (!base_data[idx]) {
            throw new Error(
                'Sorry, we are unable to execute the order at this time. Insufficient number of orders to execute your order to the market.'
            );
        }
        n -= Number(base_data[idx].amount);
        price_avg += Number(base_data[idx].price);
        idx += 1;
    }

    price_avg = price_avg / idx;

    return {
        amount,
        price: price_avg
    };
}
