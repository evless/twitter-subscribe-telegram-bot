const Telegraf = require('telegraf');
const request = require('request');
const OAuth = require('oauth');
const cron = require('cron').CronJob;
const moment = require('moment');
const http = require('http');

const bot = new Telegraf(process.env.TELEGRAF_TOKEN);
const subscribers = {};
const getSubsribeTwitterAccounts = (id) => {
    return subscribers[id] ? subscribers[id].map(item => `@${item}`).join(' ') : 'А и нет нихрена!';
}

const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;
const token = process.env.TOKEN;
const tokenSecret = process.env.TOKEN_SECRET;

var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    consumerKey,
    consumerSecret,
    '1.0A',
    null,
    'HMAC-SHA1'
);

const checkUser = (userName, callback) => {
    let url = `https://api.twitter.com/1.1/users/show.json?screen_name=${userName}`;
    oauth.get(url, token, tokenSecret, (error, body, response) => {
        let res = JSON.parse(body);

        callback(res.errors === undefined);
    });
}

bot.command('/subscribe', ({ reply, message }) => {
    let name = message.text.replace('/subscribe', '').replace('@', '').trim();
    if (!name.length) {
        reply('Ты бы хоть написал что почитать то хочешь, сынок!');
        return;
    }

    if (!subscribers[message.chat.id]) subscribers[message.chat.id] = [];
    checkUser(name, (checked) => {
        if (checked) {
            subscribers[message.chat.id].push(name);
            reply(`Вы подписались на твиттер ${name}`)
        } else {
            reply('Нет такого твиттерянского!');
        }
    });
});
bot.command('/unsubscribe', ({ message }) => {
    let name = message.text.replace('/unsubscribe', '').replace('@', '').trim();
    if (!name.length) {
        reply('Ты укажи от кого отписаться то, чо как Ромочка');
        return;
    }
    let arr = subscribers[message.chat.id];
    if (subscribers[message.chat.id]) {
        subscribers[message.chat.id] = arr.map(item => {if (item !== name) return item}).filter(item => item);
    }
});
bot.command('/getSubscribers', ({ reply, message }) => reply(`Subscribe twitters: ${getSubsribeTwitterAccounts(message.chat.id)}`))
bot.command('/getTweets', ({ reply, message }) => getTweets(reply, message.chat.id, message.text.replace('/getTweets', '').trim()))
bot.startPolling()


const getTweets = (reply, id, count = 1, checkTime = false) => {
    if (!subscribers[id]) return;
    let arr = Object.keys(subscribers[id]);

    if (!count.length) {
        reply('Укажи кол-во твитов, которое хочешь получить');
        return;
    }

    if (!arr) {
        reply('Ты подпишись сначала на чтонибудь сук');
        return;
    }
    arr.map(twitterAccount => {
        let url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${twitterAccount}&count=${count}`;
        oauth.get(url, token, tokenSecret, (error, body, response) => {
            let res = JSON.parse(body);

            if (!subscribers[id][twitterAccount]) {
                subscribers[id][twitterAccount] = moment(res[0].created_at).format('x')
            }
            
            let tweets = res.map(item => {
                let time = moment(item.created_at).format('x');

                if (checkTime) {
                    if (subscribers[id][twitterAccount] >= time) {
                        return item;
                    }

                    subscribers[id][twitterAccount] = time;
                }

                reply(
                    `${item.text}
                    https://twitter.com/${twitterAccount}/status/${item.id}`
                )
            });
        });
    })
}

let c = new cron('*/10 * * * *', () => {
    Object.keys(subscribers).forEach(sub => {
        getTweets(bot.telegram.sendMessage.bind(bot.telegram, sub), sub, '10', true);
    })
});

c.start()

http.createServer().listen(3000);