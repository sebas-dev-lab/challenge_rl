import { Request, Response, NextFunction } from 'express';
import Logger from '../../common/configs/winston.logs';
import { AuthMiddleware } from '../../useCases/auth/middleware.auth';

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // ======= Control token and verify user =========== //
        const control = new AuthMiddleware(token);
        control.verifyAndDecodeToken();
        control.verifyUser();
        const decoded = control.get_decoded();

        // ======= Save user id into request user auth context  =========== //
        req.authContext = {
            id: decoded._id
        };
        
        next();
    } catch (err) {
        Logger.error(err);
        res.status(401).json({
            code: 401,
            message: 'Unauthoized.'
        });
    }
};
