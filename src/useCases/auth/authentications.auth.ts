import { credentials, authUsers, loginType } from '../../core/auth/credentials.auth';
import { AuthCasesInterface } from '../../Infraestrucure/server/interfaces/routes.interfaces';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { contextAuth } from '../../core/auth/context.auth';
import jwt, { Secret } from 'jsonwebtoken';
import { authCase } from '../../Infraestrucure/server/envs/envs';

export class AuthCases implements AuthCasesInterface {
    /**
   * ====================== Repository METHODS ======================== *
   */
    get_context_reg(data: credentials): [authUsers | null, any[] | null] {
    // =============== Control user credentials ======== //
        if (!data.password || !data.username) {
            return [null, null];
        }
        // =============== Control if user exists into context ======== //
        const findcontext = context.get_store_by_key(contextAuth.reg);
        if (findcontext) {
            const existUser = findcontext.find((x: authUsers) => x.username === data.username);

            return [existUser, findcontext];
        }
        return [null, findcontext];
    }

    get_context_login(): any[] | null {
    // =============== Control if user exists into context ======== //
        const findcontext = context.get_store_by_key(contextAuth.login);
        if (findcontext) {
            return findcontext;
        }
        return null;
    }

    /**
   * ====================== AUTH REGISTER, LOGIN AND METHODS ======================== *
   */

    async register(data: credentials): Promise<authUsers | boolean> {
        if (!data.password || !data.username) {
            return false;
        }
        // =============== Control if user exists into context ======== //
        const [existUser, findcontext] = this.get_context_reg(data);
        if (existUser) {
            return false;
        }
        // =============== Regiter user and encypt password  ======== //
        const id: string = uuidv4();
        const encrypt = await bcrypt.hash(data.password, saltRound);
        const newUser = {
            id,
            password: encrypt,
            username: data.username
        };

        // =============== Save user into context ======== //
        if (!findcontext || !findcontext.length) {
            context.set_store({
                [contextAuth.reg]: [newUser]
            });
        } else {
            context.set_store({
                [contextAuth.reg]: [...context.get_store_by_key(contextAuth.reg), newUser]
            });
        }
        return {
            id: newUser.id,
            username: newUser.username
        };
    }

    async login(data: credentials): Promise<loginType | boolean> {
        if (!data.password || !data.username) {
            return false;
        }
        // =============== Control if user exists into context ======== //
        const [existUser, findcontext] = this.get_context_reg(data);
        if (!findcontext || !findcontext.length || !existUser || !existUser.password) {
            return false;
        }

        // =============== Verify Password ======== //
        const isMatch = bcrypt.compareSync(data.password, existUser.password);

        if (isMatch) {
            // =============== create token ======== //
            const SECRET_KEY: Secret = authCase.auth_secret;
            const token = jwt.sign({ _id: existUser.id, name: existUser.username }, SECRET_KEY, {
                expiresIn: '1 days'
            });

            // =============== Create session into context ======== //
            const newId_event = uuidv4();
            const newLogin: authUsers = {
                ...existUser,
                token,
                id_event: newId_event
            };
            const logContext = this.get_context_login();
            if (!logContext || !logContext.length) {
                context.set_store({
                    [contextAuth.login]: [newLogin]
                });
            } else {
                // =============== Control if user have a session and update or create ======== //

                const controlAuth = context
                    .get_store_by_key(contextAuth.login)
                    .find((x: authUsers) => x.username === data.username);

                if (controlAuth) {
                    context.set_store({
                        [contextAuth.login]: context
                            .get_store_by_key(contextAuth.login)
                            .filter((x: authUsers) => x.id !== existUser.id)
                    });
                }

                context.set_store({
                    [contextAuth.login]: [...context.get_store_by_key(contextAuth.login), newLogin]
                });
            }

            return {
                token,
                id_event: newId_event
            };
        }
        // =============== Unauthorized ======== //
        return false;
    }

    logout(id: string): boolean {
    // =============== Control if user exists into context ======== //
        const findcontext = this.get_context_login();
        if (findcontext && findcontext.length) {
            const existUser = findcontext.find((x: authUsers) => x.id === id);
            if (!existUser) {
                throw new Error('Unauthorized.');
            }
            // =============== Delete ======== //
            context.set_store({
                [contextAuth.login]: context
                    .get_store_by_key(contextAuth.reg)
                    .filter((x: authUsers) => x.id !== id)
            });
            return true;
        } else {
            throw new Error('Unauthorized.');
        }
    }
}
