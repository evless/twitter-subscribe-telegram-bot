import { replaceMessage, errorHelper } from '../../utils';

export const unsubscribe = ({ storage, api, regExp }) =>
    ({ message, reply }) => {
        const name = replaceMessage(message.text, regExp);
        if (!name.length) {
            reply('Напишите название твиттер аккаунта, от которого желаете отписаться.');
            return;
        }

        storage
            .removeSubscriber(message.chat.id, name)
            .then(result => reply(`Вы отписались от ${name}`))
            .catch(error => errorHelper(error, message.chat.id, reply))
    };