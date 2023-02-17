import { authToken, authUsers } from '../../core/auth/credentials.auth';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { authCase } from '../../Infraestrucure/server/envs/envs';
import { Request } from 'express';
import { contextAuth } from '../../core/auth/context.auth';

export interface CustomRequest extends Request {
  token: string | JwtPayload
}

export class AuthMiddleware {
    private token: authToken | undefined;
    private decoded: any;
    private userStore: any;

    constructor(token: authToken | undefined) {
        this.token = token;
    }

    verifyAndDecodeToken(): void {
        if (!this.token) {
            throw new Error('');
        }
        const SECRET_KEY: Secret = authCase.auth_secret;

        this.decoded = jwt.verify(this.token, SECRET_KEY);
    }

    verifyUser(): void {
        const id = this.decoded._id;
        if (!id) {
            if (!this.token) {
                throw new Error('');
            }
        }
        // =============== Control if user exists into context ======== //
        const findcontext = context.get_store_by_key(contextAuth.login);
        if (findcontext) {
            const control = findcontext.find((x: authUsers) => x.id === id);
            if (!control) {
                throw new Error();
            }
            if (control.token !== this.token) {
                throw new Error();
            }
            this.userStore = control;
        } else {
            throw new Error();
        }
    }

    get_decoded(): any {
        return this.decoded;
    }

    get_userStore(): any {
        return this.userStore;
    }
}
