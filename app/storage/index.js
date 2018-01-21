import config from 'config';
import mongoose from 'mongoose';
import Chat from './model/chat';

export default class Storage {
    init = () =>
        mongoose
            .connect(`mongodb://${config.db.ip}/${config.db.name}`)
            .then(result => console.log(`Mongoose :: Start on IP ${config.db.ip}`))
            .catch(err => {
                console.log('--- Mongoose Error Start ---');
                console.log(err)
                console.log('--- Mongoose Error End ---');
            });
    
    /**
     * Добавление твиттер аккаунта для чата.
     * 
     * @param {String} chatId
     * @param {String} subscriberName
     */
    addSubscriber = (chatId, subscriberName) =>
        new Promise((resolve, reject) =>
            this.checkAndCreateChat(chatId)
                .then(() => {
                    Chat
                        .findOne({ chatId })
                        .then(result => result.set(`subscribers.${subscriberName}`, 0))
                        .then(result => result.save())
                        .then(resolve)
                        .catch(reject)
                })
        )

    /**
     * Обновление времени у определенного твиттер аккаунта.
     * 
     * @param {String} chatId
     * @param {String} subscriberName
     * @param {String} time - Время последнего твита.
     */
    updateSubscriber = (chatId, subscriber, time) =>
        new Promise((resolve, reject) =>
            Chat
                .findOne({ chatId })
                .then(result => result.set(`subscribers.${subscriber}`, time))
                .then(result => result.save())
                .then(resolve)
                .catch(reject)
        )

    /**
     * Удаление определенного твиттер аккаунта.
     * 
     * @param {String} chatId
     * @param {String} subscriberName
     */
    removeSubscriber = (chatId, subscriberName) =>
        new Promise((resolve, reject) =>
            this.checkAndCreateChat(chatId)
                .then(() => {
                    Chat
                        .findOne({ chatId })
                        .then(result => result.set(`subscribers.${subscriberName}`, undefined))
                        .then(result => result.save())
                        .then(resolve)
                        .catch(reject)
                })
        )
    
    /**
     * Получения кол-ва твиттер аккаунтов в чате.
     * 
     * @param {String} chatId
     */
    countSubscribers = (chatId) =>
        new Promise((resolve, reject) =>
            this.checkAndCreateChat(chatId)
                .then(() => {
                    Chat
                        .findOne({ chatId })
                        .then(result => resolve(
                            result.subscribers ?
                            Object.keys(result.subscribers).length
                            : 0
                        ))
                        .catch(reject)
                })
        )

    /**
     * Добавление чата в базу.
     * 
     * @param {String} chatId
     */
    addChat = (chatId) =>
        new Promise((resolve, reject) => {
            const chat = new Chat({ chatId });
            chat.save()
                .then(resolve)
                .catch(reject)
        })
    
    /**
     * Проверка на существование чата в базе.
     * 
     * @param {String} chatId
     */
    checkChat = (chatId) =>
        new Promise((resolve, reject) =>
            Chat.count({ chatId })
                .then(resolve)
                .catch(reject)
        )
    
    /**
     * Проверка и создание чата.
     * 
     * @param {String} chatId
     */
    checkAndCreateChat = (chatId) =>
        this.checkChat(chatId)
            .then(result => {
                if (result) {
                    return result;
                }

                return this.addChat(chatId);
            })
    
    /**
     * Получение всех данных по чатам.
     */
    getAllChats = () =>
        new Promise((resolve, reject) =>
            Chat.find({})
                .then(resolve)
                .catch(reject)
        )
        
    /**
     * Получение всех твиттеров конкретного чата.
     * 
     * @param {String} chatId
     */
    getSubscribers = (chatId) =>
        new Promise((resolve, reject) =>
            this.checkAndCreateChat(chatId)
                .then(() => {
                    Chat.findOne({ chatId })
                        .then(result => resolve(result.subscribers))
                        .catch(reject)
                })
        )
}