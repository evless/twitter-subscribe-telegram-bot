export const errorHelper = (message, chatId, reply) => {
    console.log(`--- User Error Start ---`);
    console.log(`Error from ${chatId}`)
    console.log(`Message :: ${message}`);
    console.log(`--- User Error End ---`);
    reply('Что-то пошло не так! :( Обратитесь к администратору.');
}