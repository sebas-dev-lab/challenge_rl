import express, { Router } from 'express';
import { authorization } from '../../../middlewares/auth.middlewares';
import { req } from '../../../server/exceptions/http.error.exceptions';
import { AuthControllers } from '../controllers/auth.controllers';

export default function authRoutes(): Router {
    const router: Router = express.Router();
    const authControllers = new AuthControllers();

    router.post('/register', req(authControllers.registerController));
    router.post('/signin', req(authControllers.loginController));
    router.get('/signout', authorization, req(authControllers.logoutController));

    return router;
}
