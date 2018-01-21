const test = require('ava');
const config = require('config');
const utils = require('../build/utils');
const commands = require('../build/bot/commands').commandsList;

const joinCommands = (commands) => commands.map(i => `${i}|`).join('')
const getRegExp = (commands) => new RegExp(`${joinCommands(commands)}@|\\s`, 'g')

test.cb('should getCommandsRegExp utils', t => {
    commands.forEach(item => {
        const reg = getRegExp(item.commands);
        const result = utils.getCommandsRegExp(item.commands);
        t.is(result.toString(), reg.toString());
    });
    t.end();
});

test.cb('should replace message utils', t => {
    commands.forEach(item => {
        item.commands.forEach(command => {
            const message = `${command} @test`;
            const reg = getRegExp(item.commands);
            const result = utils.replaceMessage(message, reg);
            t.is(result, 'test');
        });
    });
    t.end();
});

test.cb('should oauth utils', t => {
    const oauth = utils.oauth();
    const url = `https://api.twitter.com/1.1/users/show.json?screen_name=${config.test_accounts.twitter}`;
    oauth.get(
        url,
        config.twitter.TOKEN,
        config.twitter.TOKEN_SECRET,
        (error, body, response) => {
            if (error) {
                t.fail();
            }

            const res = JSON.parse(body);

            t.true(res.errors === undefined);
            t.end();
        }
    )
});

test('should formatDateToTimestamp', t => {
    const result = utils.formatDateToTimestamp('Sun Nov 26 09:28:47 +0000 2017');
    t.is(result, '1511677727000');
});

test('should errorHelper', t => {
    utils.errorHelper('TEST', 0, (message) => {
        t.is(message, 'Что-то пошло не так! :( Обратитесь к администратору.');
    });
})
