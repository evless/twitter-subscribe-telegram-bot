import { OAuth } from 'oauth';
import config from 'config';

const consumerKey = config.twitter.CONSUMER_KEY;
const consumerSecret = config.twitter.CONSUMER_SECRET;

export const oauth = () => new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    consumerKey,
    consumerSecret,
    '1.0A',
    (a, b) => console.log('a', 'b', a, b),
    'HMAC-SHA1'
);