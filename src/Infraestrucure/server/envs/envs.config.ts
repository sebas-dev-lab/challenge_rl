import * as dotenv from 'dotenv';
import * as path from 'path';

const setEnvs = (): string => {
    let dir = null;
    switch (process.env.SERVER_CONNECTION) {
    //....
    case 'LOCAL':
        dir = path.join(__dirname, '.env.local');
        break;
    default:
        dir = path.join(__dirname, '.env');
        break;
    }
    return dir;
};

export const enviroments = (() => {
    return dotenv.config({ path: setEnvs() });
})();
