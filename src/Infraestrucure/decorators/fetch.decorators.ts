import fetchData from '../server/http_requests/fetch.http_requests';

export function Fetch(baseUrl: string | undefined) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            fetch = fetchData;
            baseUrl = baseUrl;
        };
    };
}
