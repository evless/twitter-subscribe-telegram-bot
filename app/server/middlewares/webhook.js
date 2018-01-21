import config from 'config';

export const webhook = ({ bot }) => bot.webhookCallback(`/${config.path.secret}`);