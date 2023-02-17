import { enviroments } from './envs.config';

enviroments;

export const connEnvs = {
    // ============ server envs =========== //
    server_port: process.env.PORT
};

export const useCases = {
    // ============ use cases envs =========== //
    market_ws: process.env.MARKET_BITFINEX_WS,
    market_http: process.env.MARKET_BITFINEX_HTTP,
    market_http_mk_avg_price: process.env.MARKET_BITFINEX_HTTP_MK_AVG_PRICE
};

export const authCase = {
    // ============ auth cases envs =========== //
    auth_username: process.env.AUTH_USERNAME,
    auth_password: process.env.AUTH_PASSWORD,
    auth_secret: process.env.AUTH_SECRET ? String(process.env.AUTH_SECRET) : 'secret'
};
