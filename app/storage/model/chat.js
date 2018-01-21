import mongoose from 'mongoose';

const chat = new mongoose.Schema({
    chatId: {
        type: 'string',
        required: 'chatId отсутствует.'
    },
    subscribers: {
        type: 'object'
    }
});

export default mongoose.model('Chat', chat);