import Telegraf from 'telegraf';
import config from 'config';

import { commandsList } from './commands';
import { getCommandsRegExp } from '../utils';

export const bot = new Telegraf(config.TELEGRAF_TOKEN, { username: config.telegram_bot_name });

export const initBot = ({ storage, api }) => {
    commandsList.forEach(item => {
        const commandsRegExp = item.commands.concat([config.telegram_bot_name]);

        const methosParams = {
            storage,
            api,
            commands: item.commands,
            regExp: getCommandsRegExp(commandsRegExp)
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