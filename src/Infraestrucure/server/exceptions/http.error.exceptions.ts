import { NextFunction, Request, Response } from 'express';

export const req = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
