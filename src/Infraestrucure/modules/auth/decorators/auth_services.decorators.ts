import { AuthServices } from '../services/auth.services';

export function AuthenticationServices() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            _authServices = new AuthServices();
        };
    };
}
