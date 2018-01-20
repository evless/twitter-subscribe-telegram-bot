import config from 'config';
import express from 'express';

import { webhook, getStorage, checkTweets } from './middlewares';

const server = express();

export const initServer = (...args) => {
    server
        .use(webhook(...args))
        .get(`/${config.path.getStorage}`, getStorage(...args))
        .get(`/${config.path.checkTweets}`, checkTweets(...args))
        .listen(config.PORT, () => {
            console.log(`Server :: Start on port ${config.PORT}`)
        });

    return server;
}

export default {
    server,
    initServer
}