import { ConfigConnectionInterface } from '../../interfaces/http.interfaces';
import { HttpRoutesInterface } from '../../interfaces/routes.interfaces';

export class RatherLabsConfigConnection implements ConfigConnectionInterface {
    routes: HttpRoutesInterface;
    path: string;

    constructor(rotues: HttpRoutesInterface, path: string) {
        this.routes = rotues;
        this.path = path;
    }

    middlewares(): void {
        throw new Error('Method not implemented.');
    }
}
