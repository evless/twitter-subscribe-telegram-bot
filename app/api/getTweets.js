import config from 'config';
import { formatDateToTimestamp, errorHelper } from '../utils';

export const getTweets = (oauth) =>
    ({ reply, id, count, checkTime = false, message = 'System:: ', storage }) =>        
        storage
            .countSubscribers(id)
            .then(countSubscribers => {
                count = Number(count);

                if (!countSubscribers) {
                    reply('Сначала подпишитесь на какой-нибудь твиттер аккаунт.');
                    return false;
                }

                if (!count || count <= 0) {
                    reply('Укажите кол-во твитов, которое желаете получить.');
                    return false;
                }

                if (count > 10) {
                    reply('Нельзя посмотреть больше 10 твитов, так что держите что есть:');
                    count = 10;
                }

                return true;
            })
            .then(result => { if (result) return storage.getSubscribers(id) })
            .then(result => {
                if (result) {
                    Object.keys(result).map(twitterAccount => {
                        const url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${twitterAccount}&count=${count}`;

                        oauth.get(url, config.twitter.TOKEN, config.twitter.TOKEN_SECRET, (error, body, response) => {
                            if (error) {
                                console.log('--- GetTweets Error Start ---');
                                console.log(error);
                                console.log(message);
                                console.log('--- GetTweets Error End ---');
                                return;
                            }

                            const res = JSON.parse(body);
                            
                            if (!Number(result[twitterAccount])) {
                                result[twitterAccount] = formatDateToTimestamp(res[0].created_at)
                            }
                            
                            res.reverse().forEach(item => {
                                const time = formatDateToTimestamp(item.created_at);

                                if (checkTime) {
                                    if (result[twitterAccount] >= time) {
                                        return item;
                                    }

                                    result[twitterAccount] = time;
                                }

                                reply(
                                    `https://twitter.com/${twitterAccount}/status/${item.id_str}`
                                )
                            });

                            storage.updateSubscriber(id, twitterAccount, result[twitterAccount]);
                        });
                    });
                }
            })
            .catch(error => errorHelper(error, id, reply));