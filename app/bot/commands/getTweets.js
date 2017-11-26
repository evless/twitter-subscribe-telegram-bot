import { replaceMessage } from '../../utils';

export const getTweets = ({ storage, api, regExp }) => 
    ({ reply, message }) => 
        api.getTweets({
            reply,
            id: message.chat.id,
            count: replaceMessage(message.text, regExp),
            message,
            storage
        })