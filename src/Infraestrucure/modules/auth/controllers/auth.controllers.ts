import { authUsers } from '../../../../core/auth/credentials.auth';
import {
    AuthServicesInterface,
    TypedRequestBody
} from '../../../server/interfaces/routes.interfaces';
import { Response, Request } from 'express';
import { AuthenticationServices } from '../decorators/auth_services.decorators';

@AuthenticationServices()
export class AuthControllers {
    private _authServices!: AuthServicesInterface;

    constructor() {
        this.registerController = this.registerController.bind(this);
        this.loginController = this.loginController.bind(this);
        this.logoutController = this.logoutController.bind(this);
    }

    public async registerController(
        req: TypedRequestBody<authUsers>,
        res: Response
    ): Promise<Response> {
        const reg = await this._authServices.register(req.body);
        return res.status(reg.code).json(reg);
    }

    public async loginController(req: TypedRequestBody<authUsers>, res: Response): Promise<Response> {
        const reg = await this._authServices.login(req.body);
        if (reg) {
            return res.status(reg.code).json(reg);
        }
        return res.status(403).json({ code: 403, message: 'Forbiden.' });
    }

    public async logoutController(req: Request, res: Response): Promise<Response> {
        if (req.authContext?.id) {
            const reg = await this._authServices.logout(req.authContext.id);
            return res.status(reg.code).json(reg);
        }
        return res.status(401).json({ code: 401, message: 'Unauthorized.' });
    }
}
