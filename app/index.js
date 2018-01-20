import config from 'config';

import { initBot } from './bot';
import { oauth, checkTweets } from './utils';
import { api } from './api';
import { initServer } from './server';
import Storage from './storage';

console.log('Running start...');

const apiMethods = api(oauth());
const storage = new Storage();
const bot = initBot({ storage, api: apiMethods });
const server = initServer({ bot, storage, api: apiMethods });

console.log(`Successful start :: ${process.env.NODE_ENV} mode`);