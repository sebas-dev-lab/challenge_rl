import express, { Router } from 'express';
import authRoutes from '../../../modules/auth/routes/auth.routes';
import { HttpRoutesInterface } from '../../interfaces/routes.interfaces';
import * as path from 'path';
import marketRoutes from '../../../modules/market/routes/market.routes';

export class RatherLabsHttpRoutes implements HttpRoutesInterface {
    router: Router;
    constructor() {
        this.router = express.Router();
    }
    index(): Router {
        this.router.use('/auth', authRoutes());
        this.router.use('/market', marketRoutes());

        // ========== YOU CAN SEE THE LAST REPORT ON http://localhost:<port>/api/test_view =========== //
        this.router.get('/test_view', function (req, res) {
            res.sendFile(path.join(__dirname, '../../../../test_newman/report.html'));
        });
        return this.router;
    }
}
