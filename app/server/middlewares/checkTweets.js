export const checkTweets = ({ storage, bot, api }) =>
    (req, res) => {
        const result = [];
        Object.keys(storage.getSubscribers()).forEach(id => {
            result.push(id);
            const reply = (message) => bot.telegram.sendMessage(id, message);
            api.getTweets({
                storage,
                reply,
                id,
                count: 10,
                checkTime: true
            });
        });

        res.send(`Date: ${Date.now()}; Tweets send to: ${result.join(', ')}`);
    }