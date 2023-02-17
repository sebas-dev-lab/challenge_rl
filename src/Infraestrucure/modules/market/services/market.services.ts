import { responseCasesType } from '../../../../common/types.common';
import { contentMarketTrading } from '../../../../core/market/http_subscriber.markets';
import { MarketCases } from '../decorators/market_cases.decorators';
import { HttpSubscriptionsInterface } from '../../../server/interfaces/http.interfaces';
import { MarketServicesInterface } from '../../../server/interfaces/routes.interfaces';

@MarketCases()
export default class MarketServices implements MarketServicesInterface {
    private _marketCases!: HttpSubscriptionsInterface;

    async get_market_trading(
        content: contentMarketTrading,
        user_id: string
    ): Promise<responseCasesType> {
        const trade = await this._marketCases.get_market_trading(content, user_id);
        return trade;
    }

    async update_market_trading(user_id: string, trade_id: string): Promise<responseCasesType> {
        return await this._marketCases.update_market_trading(user_id, trade_id);
    }

    async get_history_trades(user_id: string): Promise<responseCasesType> {
        return await this._marketCases.get_history_trades(user_id);
    }
}
