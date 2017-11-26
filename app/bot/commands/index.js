import { subscribe } from './subscribe';
import { unsubscribe } from './unsubscribe';
import { getSubscribers } from './getSubscribers';
import { getTweets } from './getTweets';
import { getCommandsRegExp } from '../../utils';

export const commandsList = [
    {
        commands: ['/subscribe', '/sub'],
        method: subscribe
    },
    {
        commands: ['/unsubscribe', '/unsub'],
        method: unsubscribe
    },
    {
        commands: ['/getSubscribers', '/getsubscribers', '/gsub'],
        method: getSubscribers
    },
    {
        commands: ['/getTweets', '/gettweets', '/gtw'],
        method: getTweets
    }
]