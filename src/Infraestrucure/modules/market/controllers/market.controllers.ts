import { Response } from 'express';
import { contentMarketTrading } from '../../../../core/market/http_subscriber.markets';
import {
    MarketServicesInterface,
    TypedRequestBody
} from '../../../server/interfaces/routes.interfaces';
import { Markets } from '../decorators/market_services.decorators';

@Markets()
export default class MarketsControllers {
    private _marketServices!: MarketServicesInterface;

    constructor() {
        this.get_market_trading_controller = this.get_market_trading_controller.bind(this);
        this.update_market_trading = this.update_market_trading.bind(this);
        this.get_history_trades_controller = this.get_history_trades_controller.bind(this);
    }

    async get_market_trading_controller(
        req: TypedRequestBody<contentMarketTrading>,
        res: Response
    ): Promise<Response> {
        const user_id = req.authContext?.id;
        if (user_id) {
            const trade = await this._marketServices.get_market_trading(req.body, user_id);
            return res.status(trade.code).json(trade);
        } else {
            throw new Error();
        }
    }

    async update_market_trading(
        req: TypedRequestBody<contentMarketTrading>,
        res: Response
    ): Promise<Response> {
        const user_id = req.authContext?.id;
        if (user_id) {
            const trade = await this._marketServices.update_market_trading(user_id, req.params.id);
            return res.status(trade.code).json(trade);
        } else {
            throw new Error();
        }
    }

    async get_history_trades_controller(
        req: TypedRequestBody<contentMarketTrading>,
        res: Response
    ): Promise<Response> {
        const user_id = req.authContext?.id;
        if (user_id) {
            const trade = await this._marketServices.get_history_trades(user_id);
            return res.status(trade.code).json(trade);
        } else {
            throw new Error();
        }
    }
}
