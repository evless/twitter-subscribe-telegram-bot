import Telegraf from 'telegraf';
import config from 'config';

import { commandsList } from './commands';
import { getCommandsRegExp } from '../utils';

export const bot = new Telegraf(config.TELEGRAF_TOKEN, { username: config.telegram_bot_name });

export const initBot = ({ storage, api }) => {
    console.log('Bot :: Init start');
    commandsList.forEach(item => {
        const commandsRegExp = item.commands.concat([config.telegram_bot_name]);

        const methosParams = {
            storage,
            api,
            commands: item.commands,
            regExp: getCommandsRegExp(commandsRegExp)
        };

        bot.command(item.commands, item.method(methosParams));
        console.log(`Add commands ${item.commands[0]}`);
    });
    bot.catch(error => {
        console.log('--- Bot Catch Start ---');
        console.log(error);
        console.log('--- Bot Catch End ---');
    });
    bot.telegram.setWebhook(`${config.domain}/${config.path.secret}`);

    console.log('Bot :: Init end');
    return bot;
}

export default {
    initBot,
    bot
}