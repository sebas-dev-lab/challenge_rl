import newman from 'newman'; // require Newman in your project
import * as path from 'path';
import Logger from '../common/configs/winston.logs';
import { connEnvs } from '../Infraestrucure/server/envs/envs';
// call newman.run to pass `options` object and wait for callback
export const run_test = newman.run(
    {
        collection: require('./test_case_postman.json'),
        environment: require('./test_case_postman_envs.json'),
        reporters: ['cli', 'htmlextra'],
        reporter: {
            htmlextra: {
                export: path.join(__dirname, './report.html'),
                logs: true,
                browserTitle: 'Testing report',
                title: 'Testing Challenge',
                showEnvironmentData: true,
            }
        }
    },
    function (err) {
        if (err) {
            Logger.error('Error in collection run: ', err);
            throw err;
        }
        Logger.info(`Testing completed. You can see the report in: http://localhost:${connEnvs.server_port}/api/test_view`);
    }
);
