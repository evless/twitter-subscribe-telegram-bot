export const checkTweets = ({ storage, bot, api }) =>
    (req, res) =>
        storage
            .getAllChats()
            .then(chats => {
                const result = [];
                chats.forEach(({ chatId }) => {
                    result.push(chatId);
                    const reply = (message) => bot.telegram.sendMessage(chatId, message);
                    api.getTweets({
                        storage,
                        reply,
                        id: chatId,
                        count: 10,
                        checkTime: true
                    });
                });

                res.send(`Date: ${Date.now()}; Tweets send to: ${result.join(', ')}`);
            });