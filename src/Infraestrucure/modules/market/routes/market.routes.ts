import express, { Router } from 'express';
import { authorization } from '../../../middlewares/auth.middlewares';
import { req } from '../../../server/exceptions/http.error.exceptions';
import MarketsControllers from '../controllers/market.controllers';

export default function marketRoutes(): Router {
    const router: Router = express.Router();
    const marketControllers = new MarketsControllers();

    router.post('/trade', authorization, req(marketControllers.get_market_trading_controller));
    router.get('/trade/:id', authorization, req(marketControllers.update_market_trading));
    router.get('/trade', authorization, req(marketControllers.get_history_trades_controller));


    return router;
}
