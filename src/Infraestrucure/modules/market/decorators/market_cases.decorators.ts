import HttpSubscriptions from '../../../../useCases/merket/http_subscriptions.market';

export function MarketCases() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            _marketCases = new HttpSubscriptions();
        };
    };
}
