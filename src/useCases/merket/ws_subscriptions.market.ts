import { WebSocket } from 'ws';
import { contexts, typeAuthContext, ws_connection } from '../../core/auth/context.auth';
import {
    CandlesSubscribeFromCli,
    CandlesSubscriberToBx,
    channelSubscribers,
    TickerSubscriberToBx
} from '../../core/market/ws_subscriber.market';
import { Bitfinex_ws_connection } from '../../Infraestrucure/decorators/bitfinex_ws_conn.decorators';
import { useCases } from '../../Infraestrucure/server/envs/envs';
import { create_subscriber } from './utils.market';

@Bitfinex_ws_connection(useCases.market_ws)
export class SubscribeBfxEvents {
    private ws!: WebSocket;
    private to_subscribe!: CandlesSubscribeFromCli | TickerSubscriberToBx | CandlesSubscriberToBx;
    private ws_cli!: WebSocket;
    private store!: Array<ws_connection>;
    private contexts!: contexts;

    public before_subscribe(
        data: CandlesSubscribeFromCli,
        cli: WebSocket,
        authType: typeAuthContext,
        id_event: string,
        id_conn: string
    ): void {
    // ====== Parse data to be send and store into context ========= //
        if (!data.channel || !data.event || !data.symbol || !id_event) {
            cli.send('Invalid data.');
        }
        this.ws_cli = cli;
        data.symbol = data.symbol.toUpperCase();
        data.channel = data.channel.toLowerCase();

        switch (data.channel) {
        case channelSubscribers.candles:
            if (!data.time_frame) {
                cli.send('Invalid data.');
                break;
            }
            this.to_subscribe = {
                event: data.event,
                channel: data.channel,
                key: `trade:${data.time_frame}:t${data.symbol}`
            };
            break;
        case channelSubscribers.ticker:
            this.to_subscribe = {
                event: data.event,
                channel: data.channel,
                symbol: `t${data.symbol}`
            };
            break;
        default:
            cli.send('Invalid data.');
            break;
        }
        // ====== Set Subscribers to context by public or private connection ========= //
        const newSubscription = create_subscriber(data.channel, {
            ...(channelSubscribers.candles
                ? { key: `trade:${data.time_frame}:t${data.symbol}` }
                : { pair: `t${data.symbol}` })
        });
        if (authType === typeAuthContext.private) {
            // ======= Set Private contexts ============ //
            this.contexts = contexts.ws_conn;
            this.store = commonContext[contexts.ws_conn].get_store_by_key(id_event);
        } else {
            // ======= Set public contexts ============ //
            this.contexts = contexts.pub_ws_conn;
            this.store = commonContext[contexts.pub_ws_conn].get_store_by_key(id_event);
        }

        if (!this.store || !this.store.length) {
            // ======= Store must be exists ============ //
            cli.send('Something was wrong!');
        } else {
            const find: ws_connection | undefined = this.store.find((x) => x._creds.id_conn === id_conn);
            if (!find || !find?._creds.id_event) {
                // ======= Contexts connection should have been created in the connection process ============ //
                cli.send('Something was wrong! We could not find subscribers.');
            } else {
                // ======= It is all ok then save subsciption into context ============ //
                commonContext[this.contexts].set_store({
                    [find?._creds.id_event]: this.store.map((x) => {
                        if (x._creds.id_conn === id_conn) {
                            return {
                                ...find,
                                date: new Date(),
                                subscribers: find?.subscribers
                                    ? [...find.subscribers, newSubscription]
                                    : [newSubscription]
                            };
                        } else {
                            return x;
                        }
                    })
                });
            }
        }
    }
    public req_subscribe(): void {
    // ====== Request subscribe to BTFX ========= //
    // ====== Send Subscribe ========= //
        try {
            const toSend = JSON.stringify(this.to_subscribe);
            this.ws.on('open', () => {
                return this.ws.send(toSend);
            });
        } catch (e: any) {
            throw new Error(e ? e : 'BFX connection error.');
        }
    }

    public emit_subscribe(): void {
    // ====== Emit Events from BTFX to Cli ========= //
        try {
            this.ws.on('message', (data: any) => {
                this.ws_cli.send(data.toString());
            });
        } catch (e: any) {
            throw new Error(e ? e : 'BFX connection error.');
        }
    }

    public close_subscription(): void {
        try {
            this.ws.close();
        } catch (e: any) {
            throw new Error(e ? e : 'BFX connection error.');
        }
    }
}
