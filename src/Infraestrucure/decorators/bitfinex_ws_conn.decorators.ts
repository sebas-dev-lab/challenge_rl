import WebSocket from 'ws';

export function Bitfinex_ws_connection(uri: string | undefined) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            ws = uri ? new WebSocket(uri) : null;
        };
    };
}
