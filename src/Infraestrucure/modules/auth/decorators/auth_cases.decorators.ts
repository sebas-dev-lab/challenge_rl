import { AuthCases } from '../../../../useCases/auth/authentications.auth';

export function AuthenticationCases() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            _authCases = new AuthCases();
        };
    };
}
