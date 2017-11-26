export default class Storage {
    data = {
        subscribers: {}
    }

    getData = () => this.data;
    getSubscribers = () => this.data.subscribers;

    getSubsribeTwitterAccounts = (id) => {
        return this.data.subscribers[id]
            ? Object.keys(this.data.subscribers[id]).map(item => `@${item}`).join(' ')
            : 'А и нет нихрена!';
    }
}