import { replaceMessage } from '../../utils';

export const unsubscribe = ({ storage, api, regExp }) =>
    ({ message, reply }) => {
        const name = replaceMessage(message.text, regExp);
        if (!name.length) {
            reply('Ты укажи от кого отписаться то, чо как Ромочка');
            return;
        }

        if (storage.subscribers[message.chat.id]) {
            reply(`Вы отписались от ${name}`)
            delete storage.subscribers[message.chat.id][name];
        }
    };