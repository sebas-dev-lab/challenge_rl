import { v4 as uuidv4 } from 'uuid';
import { run_test } from './test_newman/index.newman';
import AuthContext from './common/context/auth_context/context';
import Connections from './Infraestrucure/server/main.connection';
import ratherLabsServer from './Infraestrucure/server/ratherlabs.app.server';
import CommonContext from './common/context/common_context/context';
import { contexts } from './core/auth/context.auth';

// ============== Create context to manage data in memory ============ //
global.context = new AuthContext(uuidv4(), {});
global.commonContext = {
    [contexts.ws_conn]: new CommonContext(uuidv4(), {}),
    [contexts.pub_ws_conn]: new CommonContext(uuidv4(), {}),
    [contexts.historical]: new CommonContext(uuidv4(), {})
};

// ============== Set a conection ================= //
export const connection = new Connections([ratherLabsServer]);

connection.init();

// ======== RUN TEST WHEN INIT APP ============ //
/**
 *  You must see console test and you can see html report on test_newman/reports.html
 *  or go to http://localhost:<port>/api/test_view
 */
//run_test;