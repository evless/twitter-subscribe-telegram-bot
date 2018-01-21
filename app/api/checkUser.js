import config from 'config';

export const checkUser = (oauth) => ({ name, message, callback }) => {
    const url = `https://api.twitter.com/1.1/users/show.json?screen_name=${name}`;
    oauth.get(url, config.twitter.TOKEN, config.twitter.TOKEN_SECRET, (error, body, response) => {
        if (error) {
            console.log('--- CheckUser Error Start ---');
            console.log(error);
            console.log(message);
            console.log('--- CheckUser Error End ---');
        }

        const res = JSON.parse(body);

        callback(res.errors === undefined);
    });
}