import morgan from 'morgan';

import Logger from './winston.logs';

const stream: morgan.StreamOptions = {
    // Use the http severity
    write: (message) => Logger.http(message)
};
const skip = () => {
    const env = process.env.NODE_ENV || 'development';
    return env !== 'development';
};

// Build the morgan middleware
const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream,
    skip
});

export default morganMiddleware;
