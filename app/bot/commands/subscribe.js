import { replaceMessage, errorHelper } from '../../utils';

export const subscribe = ({ storage, api, regExp }) =>
    ({ reply, message }) => {
        const name = replaceMessage(message.text, regExp);
        if (!name.length) {
            reply('Ты бы хоть написал что почитать то хочешь, сынок!');
            return;
        }

        api.checkUser({
            name,
            message,
            callback(checked) {
                if (checked) {
                    storage
                        .addSubscriber(message.chat.id, name)
                        .then(result => reply(`Вы подписались на твиттер ${name}`))
                        .catch(error => errorHelper(error, message.chat.id, reply))
                } else {
                    reply('Такой твиттер аккаунт не найден.');
                }
            }
        });
    };