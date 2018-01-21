const test = require('ava');
const mongoose = require('mongoose');
const config = require('config');
const nanoid = require('nanoid');
const Storage = require('../build/storage').default;
const storage = new Storage();

const size = 10;

test.before(t => {
    mongoose.connect(`mongodb://${config.db.ip}/${config.db.name}`)
    mongoose.connection.once('connected', () => {
        mongoose.connection.db.dropDatabase();
    });
});

test.cb('should addChat method', t => {
    storage
        .addChat(nanoid(size))
        .then(() => t.end());
});

test.cb('should checkChat method', t => {
    const chatId = nanoid(size);
    storage
        .addChat(chatId)
        .then(() => storage.checkChat(chatId))
        .then(result => {
            t.is(result, 1);
            t.end();
        });
});

test.cb('should checkAndCreateChat method', t => {
    const chatId = nanoid(size);
    storage
        .checkAndCreateChat(chatId)
        .then(() => storage.checkChat(chatId))
        .then(result => {
            t.is(result, 1);
            t.end();
        });
});

test.cb('should addSubscriber and getSubscribers method', t => {
    const chatId = nanoid(size);
    storage
        .addSubscriber(chatId, config.test_accounts.twitter)
        .then(() => storage.getSubscribers(chatId))
        .then((result) => {
            t.is(result[config.test_accounts.twitter], 0);
            t.end();
        });
});

test.cb('should addSubscriber method', t => {
    const chatId = nanoid(size);
    const time = 1000;
    storage
        .addSubscriber(chatId, config.test_accounts.twitter)
        .then(() => storage.updateSubscriber(chatId, config.test_accounts.twitter, time))
        .then(() => storage.getSubscribers(chatId))
        .then((result) => {
            t.is(result[config.test_accounts.twitter], time);
            t.end();
        });
});

test.cb('should removeSubscriber method', t => {
    const chatId = nanoid(size);
    const time = 1000;
    storage
        .addSubscriber(chatId, config.test_accounts.twitter)
        .then(() => storage.removeSubscriber(chatId, config.test_accounts.twitter))
        .then(() => storage.getSubscribers(chatId))
        .then((result) => {
            t.is(result[config.test_accounts.twitter], undefined);
            t.end();
        });
});

test.cb('should countSubscribers method', t => {
    const chatId = nanoid(size);
    const time = 1000;
    storage
        .addSubscriber(chatId, config.test_accounts.twitter)
        .then(() => storage.countSubscribers(chatId))
        .then((result) => {
            t.is(result, 1);
            t.end();
        });
});