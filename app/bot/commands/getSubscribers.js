import { errorHelper } from '../../utils';

export const getSubscribers = ({ storage }) =>
    ({ reply, message }) =>
        storage
            .getSubscribers(message.chat.id)
            .then(result => {
                if (result) {
                    return `Вы подписаны на: ${Object.keys(result).map(item => `@${item}`).join(' ')}`;
                }

                return 'Вы еще ни на что не подписаны.';
            })
            .then(result => reply(result))
            .catch(error => errorHelper(error, message.chat.id, reply))