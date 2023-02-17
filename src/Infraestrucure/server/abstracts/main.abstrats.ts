import { HttpConnectionInterface } from '../interfaces/http.interfaces';
import { WsConnectionInterface } from '../interfaces/ws.interface';
import * as http from 'http';
import * as WebSocket from 'ws';
import { MainConnectionInterface } from '../interfaces/connectiosn.interface';
import Logger from '../../../common/configs/winston.logs';

export abstract class MainConnectionAbstract implements MainConnectionInterface {
    conn_http: HttpConnectionInterface | undefined;
    conn_ws: WsConnectionInterface | undefined;
    combine: boolean;
    _port: number;
    ws_options: any;
    http_options: any;

    constructor(configs: {
    http?: HttpConnectionInterface
    ws?: WsConnectionInterface
    port: number
    ws_options?: any
    http_options?: any
  }) {
        this.conn_http = configs.http;
        this.conn_ws = configs.ws;
        this._port = configs.port;
        this.ws_options = configs.ws_options;
        this.http_options = configs.http_options;
        if (configs.http && configs.ws) {
            this.combine = true;
        } else {
            this.combine = false;
        }
    }

    main_start(): void {
        if (this.combine && this.conn_http && this.conn_ws) {
            const server = http.createServer(this.conn_http.get_server());
            const wsServer = new WebSocket.Server({ server, ...this.ws_options });
            this.conn_ws.set_server(wsServer);

            server.listen(this._port, () => {
                Logger.info('HTTP & WS connection.');
                Logger.info(`Server on port: ${this._port}`);
            });
        } else if (!this.combine && this.conn_http) {
            Logger.info('HTTP connection.');
            this.conn_http.start(this._port);
        } else if (!this.combine && this.conn_ws) {
            Logger.info('WS connection.');
            this.conn_ws.start(this._port);
        } else {
            throw new Error('Start Server configuration Error.');
        }

        // =========== to set context =========== //
        global.saltRound = 8;
        Logger.info(`Auth context id: ${context.context_id}`);
        for (const c in commonContext) {
            Logger.info(`Common contexts: ${c}`);
        }
    }
}
