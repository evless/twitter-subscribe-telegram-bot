import { scheduleJob } from 'node-schedule';

const handler = ({ storage, bot, api }) => () => {
    Object.keys(storage.data.subscribers).forEach(id => {
        console.log(id);
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