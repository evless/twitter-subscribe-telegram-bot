import config from 'config';

import { initBot } from './bot';
import { oauth } from './utils';
import { api } from './api';
import Storage from './storage';

const apiMethods = api(oauth());
const storage = new Storage();
const bot = initBot({ storage, api: apiMethods });

console.log(`Started bot :: ${process.env.NODE_ENV} mode`);