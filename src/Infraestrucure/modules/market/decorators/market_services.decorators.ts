import MarketServices from '../services/market.services';

export function Markets() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            _marketServices = new MarketServices();
        };
    };
}
