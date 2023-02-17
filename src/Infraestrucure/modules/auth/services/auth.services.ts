import { responseCasesType } from '../../../../common/types.common';
import { response } from '../../../../common/utils.common';
import { credentials } from '../../../../core/auth/credentials.auth';
import { AuthenticationCases } from '../decorators/auth_cases.decorators';
import {
    AuthCasesInterface,
    AuthServicesInterface
} from '../../../server/interfaces/routes.interfaces';

@AuthenticationCases()
export class AuthServices implements AuthServicesInterface {
    private _authCases!: AuthCasesInterface;
    private response = response;


    async register(data: credentials): Promise<responseCasesType> {
        const register = await this._authCases.register(data);
        return this.response(
            register,
            'User was register successfully.',
            'Something was wrong!.',
            201,
            403
        );
    }

    async login(data: credentials): Promise<responseCasesType> {
        const log = await this._authCases.login(data);
        return this.response(log, 'User login successfully.', 'Something was wrong!.', 200, 401);
    }

    logout(id: string): responseCasesType {
        const log = this._authCases.logout(id);
        return this.response(log, 'User logout successfully.', 'Something was wrong!.', 200, 403);
    }
}
