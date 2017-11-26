export const getSubscribers = ({ storage }) =>
    ({ reply, message }) =>
        reply(`Вы подписаны на: ${storage.getSubsribeTwitterAccounts(message.chat.id)}`);