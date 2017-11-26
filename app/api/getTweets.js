import config from 'config';
import moment from 'moment';

const dateFormat = 'ddd MMM DD HH:mm:ss';

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
                    storage.data.subscribers[id][twitterAccount] = moment(res[0].created_at, dateFormat).format('x')
                }

                res.forEach(item => {
                    const time = moment(item.created_at, dateFormat).format('x');

                    if (checkTime) {
                        if (storage.data.subscribers[id][twitterAccount] >= time) {
                            return item;
                        }

                        storage.data.subscribers[id][twitterAccount] = time;
                    }

                    reply(
                        `${item.text}
                        https://twitter.com/${twitterAccount}/status/${item.id}`
                    )
                });
            });
        })
    }