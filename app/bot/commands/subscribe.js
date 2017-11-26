import { replaceMessage } from '../../utils';

export const subscribe = ({ storage, api, regExp }) =>
    ({ reply, message }) => {
        const name = replaceMessage(message.text, regExp);
        if (!name.length) {
            reply('Ты бы хоть написал что почитать то хочешь, сынок!');
            return;
        }

        if (!storage.getData().subscribers[message.chat.id]) {
            storage.getData().subscribers[message.chat.id] = {};
        }

        api.checkUser({
            name,
            message,
            callback(checked) {
                if (checked) {
                    storage.getData().subscribers[message.chat.id][name] = 0;
                    reply(`Вы подписались на твиттер ${name}`)
                } else {
                    reply('Нет такого твиттерянского!');
                }
            }
        });
    };