import { CronJob } from 'cron';

const handler = ({ storage, bot, api }) => () => {
    Object.keys(storage.data.subscribers).forEach(id => {
        const reply = bot.telegram.sendMessage.bind(bot.telegram, id);
        api.getTweets({
            storage,
            reply,
            id,
            count: 10,
            checkTime: true
        });
    })
}

export const cron = ({ cron = '*/1 * * * *', storage, bot, api }) => {
    const timer = new CronJob(cron, handler({ storage, bot, api }));
    timer.start();
    return timer;
}