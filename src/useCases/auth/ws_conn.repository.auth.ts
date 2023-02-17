import { WebSocket } from 'ws';
import { contexts, ws_connection } from '../../core/auth/context.auth';
import { subscribers } from '../../core/market/ws_subscriber.market';
import { create_subscriber } from '../merket/utils.market';

export class AuthWsConnection {
    private store: Array<ws_connection> | undefined;
    private id_event: string | undefined;
    private id_connection: string | undefined;
    private connection: WebSocket | undefined;
    private error: boolean | undefined;
    private context: contexts | undefined;

    set_credentials(idv: string, idc: string, conn: WebSocket, context: contexts): void {
        this.id_event = idv;
        this.id_connection = idc;
        this.connection = conn;
        this.context = context === contexts.ws_conn ? contexts.ws_conn : contexts.pub_ws_conn;
    }

    set_connection(): void {
        try {
            if (this.id_event && this.context) {
                this.store = commonContext[this.context].get_store_by_key(this.id_event);

                if (!this.store || !this.store.length) {
                    // ================ Create new connection ============== //
                    this.create_ws_connection();
                } else {
                    // ================ Update connection ============== //
                    const find = this.store.find((x) => x._creds.id_conn === this.id_connection);

                    if (!find) {
                        this.create_ws_connection();
                    } else {
                        if (this.id_connection) {
                            commonContext[this.context].set_store({
                                [this.id_connection]: [
                                    ...this.store,
                                    {
                                        ...find,
                                        date: new Date()
                                    }
                                ]
                            });
                        } else {
                            this.error = true;
                        }
                    }
                }
            } else {
                this.error = true;
            }
        } catch (e: any) {
            this.error = true;
        }
    }

    set_subscriber(channel: string, key: string): void {
        if (!this.store || !this.store.length) {
            // ======= Store must be exists ============ //
            this.error = true;
        } else {
            // ======= Find ws connection by id_connection => mean subscriber type ============ //
            const find: ws_connection | undefined = this.store.find(
                (x) => x._creds.id_conn === this.id_connection
            );
            if (!find) {
                // ======= Create subscriber ============ //
                this.create_ws_connection(create_subscriber(channel, { key }));
            } else {
                // ======= Update subscriber ============ //
                if (this.id_connection && this.context) {
                    commonContext[this.context].set_store({
                        [this.id_connection]: [
                            ...this.store,
                            {
                                ...find,
                                date: new Date(),
                                subscribers: find.subscribers
                                    ? [...find.subscribers, create_subscriber(channel, { key })]
                                    : [create_subscriber(channel, { key })]
                            }
                        ]
                    });
                } else {
                    this.error = true;
                }
            }
        }
    }

    get_store(): Array<ws_connection> | undefined {
        return this.store;
    }

    get_error(): boolean | undefined {
        return this.error;
    }

    create_ws_connection(subs?: subscribers): void {
    // ================ Create new connection ============== //
        if (this.connection && this.id_connection && this.id_event && this.context) {
            const newStore: ws_connection = {
                connection: this.connection,
                date: new Date(),
                _creds: {
                    id_conn: this.id_connection,
                    id_event: this.id_event,
                    online: true
                },
                subscribers: subs ? [subs] : []
            };
            commonContext[this.context].set_store({
                [this.id_event]: !commonContext[this.context].get_store_by_key(this.id_event)
                    ? [newStore]
                    : commonContext[this.context].get_store_by_key(this.id_event).concat([newStore])
            });
        } else {
            this.error = true;
        }
    }

    clean_ws_connection(
        id_event: string | undefined,
        id_conn: string | undefined,
        context: contexts | undefined
    ): void {
        if (context && id_event) {
            if (context === contexts.ws_conn) {
                commonContext[context].set_store({
                    [id_event]: commonContext[context].get_store_by_key(id_event).map((x) => {
                        if (x._creds.id_conn === id_conn) {
                            x.connection = null;
                            x._creds.online = false;
                            return x;
                        } else {
                            return x;
                        }
                    })
                });
            } else {
                if (commonContext[context].store[id_event]) {
                    delete commonContext[context].store[id_event];
                }
            }
        }
    }
}
