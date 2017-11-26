import { checkUser } from './checkUser';
import { getTweets } from './getTweets';

export const api = (oauth) => ({
    checkUser: checkUser(oauth),
    getTweets: getTweets(oauth)
})