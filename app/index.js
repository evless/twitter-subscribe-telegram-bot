import config from 'config';

import { initBot } from './bot';
import { oauth, cron } from './utils';
import { api } from './api';
import Storage from './storage';

const apiMethods = api(oauth());
const storage = new Storage();
const bot = initBot({ storage, api: apiMethods });
if (config.cron.on) {
    cron({ cron: config.cron.expression, storage, api: apiMethods, bot });
}