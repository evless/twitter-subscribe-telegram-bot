import Telegraf from 'telegraf';
import config from 'config';

import { commandsList } from './commands';
import { getCommandsRegExp } from '../utils';

export const bot = new Telegraf(config.TELEGRAF_TOKEN);

export const initBot = ({ storage, api }) => {
    commandsList.forEach(item => {
        const methosParams = {
            storage,
            api,
            commands: item.commands,
            regExp: getCommandsRegExp(item.commands)
        };

        bot.command(item.commands, item.method(methosParams));
    });
    bot.catch(error => {
        console.log('>>> Bot Catch:');
        console.log(error);
    });
    bot.startPolling();

    return bot;
}

export default {
    initBot,
    bot
}