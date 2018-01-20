import config from 'config';
import { formatDateToTimestamp } from '../utils';

export const getTweets = (oauth) =>
    ({ reply, id, count, checkTime = false, message = 'System:: ', storage }) => {
        const arr = Object.keys(storage.data.subscribers[id] || []);
        count = Number(count);

        if (!arr.length) {
            reply('Ты подпишись сначала на что-нибудь сук');
            return;
        }

        if (!count || count <= 0) {
            reply('Укажи кол-во твитов, которое хочешь получить');
            return;
        }

        if (count > 10) {
            reply('Нельзя посмотреть больше 10 твитов, так что держи что есть:');
        }

        arr.map(twitterAccount => {
            const url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${twitterAccount}&count=${count}`;

            oauth.get(url, config.twitter.TOKEN, config.twitter.TOKEN_SECRET, (error, body, response) => {
                if (error) {
                    console.log('>>> GetTweets:');
                    console.log(error);
                    console.log(message);
                    return;
                }

                const res = JSON.parse(body);

                if (!storage.data.subscribers[id][twitterAccount]) {
                    storage.data.subscribers[id][twitterAccount] = formatDateToTimestamp(res[0].created_at)
                }

                res.reverse().forEach(item => {
                    const time = formatDateToTimestamp(item.created_at);

                    if (checkTime) {
                        if (storage.data.subscribers[id][twitterAccount] >= time) {
                            return item;
                        }

                        storage.data.subscribers[id][twitterAccount] = time;
                    }

                    reply(
                        `https://twitter.com/${twitterAccount}/status/${item.id_str}`
                    )
                });
            });
        })
    }