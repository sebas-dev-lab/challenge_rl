import WebSocket from 'ws';
import { EventEmitter } from 'ws';
import { WsConnectionInterface } from '../interfaces/ws.interface';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthMiddleware } from '../../../useCases/auth/middleware.auth';
import { authUsers } from '../../../core/auth/credentials.auth';
import { contexts, typeAuthContext } from '../../../core/auth/context.auth';
import { SubscribeBfxEvents } from '../../../useCases/merket/ws_subscriptions.market';
import { CandlesSubscribeFromCli } from '../../../core/market/ws_subscriber.market';
import { AuthWsConnection } from '../../../useCases/auth/ws_conn.repository.auth';
import Logger from '../../../common/configs/winston.logs';

export class WsConnectionAbstract implements WsConnectionInterface {
    private server: any;
    private options: any;
    private clients: {
    [key: string]: {
      ws: WebSocket
      on_subscribed: boolean
      id_event?: string
      context?: contexts
      bfx?: SubscribeBfxEvents
    }
  } = {};
    private private_manage = new AuthWsConnection();
    private public_manage = new AuthWsConnection();

    constructor(options?: any) {
        this.options = options;
    }

    connect(): void {
        this.server?.on('connection', (websocket: WebSocket, req: Request) => {
            const connId = uuidv4();
            this.clients[connId] = {
                ws: websocket,
                on_subscribed: false
            };
            try {
                // ========== Control connection token & id_event ======== //
                const token = req.headers.token;
                const idev = req.headers.id_event;
                if (!token && !idev) {
                    // ================ Public ==================== //
                    this.public_connection(connId, this.clients[connId]['ws']);
                } else if ((token && !idev) || (!token && idev)) {
                    throw new Error('Unauthorized.');
                } else if (token && idev) {
                    // ================ Private => only loged users ==================== //
                    this.private_connection(connId, this.clients[connId]['ws'], String(token));
                } else {
                    throw new Error('Unauthorized.');
                }
            } catch (e: any) {
                this.clients[connId]['ws'].send('Unauthorized.');
                this.clients[connId]['ws'].close();
            }
        });
    }

    disconnet(id: string): void {
    // ============ Disconnect ============= //
        Logger.info(`Disconnected cliet id: ${id}`);
        if (this.clients[id].on_subscribed) {
            this.clients[id].bfx?.close_subscription();
        }
        this.public_manage.clean_ws_connection(this.clients[id].id_event, id, this.clients[id].context);
        delete this.clients[id];
    }

    public_connection(connId: string, websocket: WebSocket): void {
        let error = '';
        try {
            const pub_id_event = uuidv4();
            this.clients[connId].id_event = pub_id_event;
            this.clients[connId].context = contexts.pub_ws_conn;
            // ========== Set coonnection into context ======== //
            this.public_manage.set_credentials(pub_id_event, connId, websocket, contexts.pub_ws_conn);
            this.public_manage.set_connection();

            if (this.public_manage.get_error()) {
                error = 'Something was wrong.';
                throw new Error();
            }
            this.clients[connId]['ws'].send(
                JSON.stringify({
                    _id: pub_id_event,
                    connection: true
                })
            );

            websocket.on('message', (data: any) => {
                this.set_bfx_connection(typeAuthContext.public, data, websocket, pub_id_event, connId);
            });

            websocket.on('close', () => {
                this.disconnet(connId);
            });
        } catch (e: any) {
            this.clients[connId]['on_subscribed'] = false;
            this.clients[connId]['ws'].send(error ? error : e.message);
            this.clients[connId]['ws'].close();
        }
    }

    private_connection(connId: string, websocket: WebSocket, token: string): void {
        const error = undefined;
        try {
            const authControl = new AuthMiddleware(String(token));
            authControl.verifyAndDecodeToken();
            authControl.verifyUser();
            const { id_event }: authUsers = authControl.get_userStore();

            if (!id_event) {
                throw new Error('Unauthorized.');
            }
            this.clients[connId].id_event = id_event;
            this.clients[connId].context = contexts.ws_conn;

            // ========== Set coonnection into context ======== //
            this.private_manage.set_credentials(String(id_event), connId, websocket, contexts.ws_conn);
            this.private_manage.set_connection();

            // ========== Control id_event ======== //
            if (this.clients[connId]['ws'].readyState === WebSocket.OPEN) {
                this.clients[connId]['ws'].send(`Private Account Connected _ID: ${connId}`);
                this.clients[connId]['ws'].send(
                    JSON.stringify({
                        _id: connId,
                        id_event,
                        connection: true
                    })
                );
            }

            websocket.on('message', (data: any) => {
                this.set_bfx_connection(typeAuthContext.private, data, websocket, id_event, connId);
            });

            websocket.on('close', () => {
                this.disconnet(connId);
            });
        } catch (e: any) {
            this.clients[connId]['on_subscribed'] = false;
            this.clients[connId]['ws'].send(error ? error : e.message ? e.message : e);
            this.clients[connId]['ws'].close();
        }
    }

    set_bfx_connection(
        type: typeAuthContext,
        data: CandlesSubscribeFromCli,
        websocket: WebSocket,
        id_event: string,
        connId: string
    ): void {
        this.clients[connId].bfx = new SubscribeBfxEvents();
        // ============ Events subscription process ============= //
        const incomming: CandlesSubscribeFromCli = JSON.parse(data.toString());

        // ========= SET CONTEXT AND SUBSCRIBE PARSE ==== //
        this.clients[connId].bfx?.before_subscribe(incomming, websocket, type, id_event, connId);
        this.clients[connId]['on_subscribed'] = true;
        this.clients[connId].bfx?.req_subscribe();
        // ========= EMIT SUBSCRIBER EVENTS FROM BTFX ==== //
        this.clients[connId].bfx?.emit_subscribe();
    }

    set_server(server: EventEmitter): void {
        this.server = server;

        this.connect();
    }

    start(port: number): void {
        this.server = new WebSocket.Server({
            port,
            ...this.options
        });
    }
}
