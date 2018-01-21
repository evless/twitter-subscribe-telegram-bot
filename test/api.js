const test = require('ava');
const config = require('config');
const moment = require('moment');
const utils = require('../build/utils');
const api = require('../build/api').api;

const oauth = utils.oauth();
let apiMethods;

let storage = {}

test.before(t => {
    storage = {
        data: {
            [config.test_accounts.twitter]: 0
        },
        countSubscribers: () => Promise.resolve(1),
        getSubscribers: (id) => Promise.resolve(storage.data),
        updateSubscriber(chatId, subscriber, time) {
            storage.data[subscriber] = time;
            return Promise.resolve(storage.data)
        }
    };
})

test('should get apiMethods', t => {
    apiMethods = api(oauth);
    t.is(typeof apiMethods, 'object')
});

test.cb('should checkUser api', t => {
    const callback = (checked) => {
        t.true(checked === true);
        t.end();
    };

    apiMethods.checkUser({
        name: config.test_accounts.twitter,
        message: '',
        callback
    });
});

test.cb('should getTweets api', t => {
    let counter = 0;
    let countMessage = 3;
    const reply = (message) => {
        counter++;
        t.true(message.indexOf(`https://twitter.com/${config.test_accounts.twitter}/status/`) > -1);
        if (counter === countMessage) {
            t.end();
        }
    };

    apiMethods.getTweets({
        reply,
        id: 0,
        count: countMessage,
        message: '',
        storage
    });
});

test.cb('should getTweets with checkTime api', t => {
    const oauth = utils.oauth();
    const dateFormat = 'ddd MMM DD HH:mm:ss +ZZ YYYY';
    let prevLastTweet;
    let lastTweet;
    const url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${config.test_accounts.twitter}&count=2`;
    const reply = (message) => {
        t.true(message.indexOf(`https://twitter.com/${config.test_accounts.twitter}/status/`) > -1);
        t.true(message.indexOf(lastTweet.id_str) > -1);
        t.true(message.indexOf(prevLastTweet.id_str) === -1);
        t.end();
    };
    oauth.get(
        url,
        config.twitter.TOKEN,
        config.twitter.TOKEN_SECRET,
        (error, body, response) => {
            if (error) {
                t.fail();
            }

            const res = JSON.parse(body);
            lastTweet = res[0];
            prevLastTweet = res[1];
            storage.data[config.test_accounts.twitter] = moment(prevLastTweet.created_at, dateFormat).format('x')
            apiMethods.getTweets({
                reply,
                id: 0,
                count: 2,
                checkTime: true,
                message: '',
                storage
            });
        }
    )
});