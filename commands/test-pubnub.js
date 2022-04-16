const pubnub = require('../helpers/pubnub-helper');

const command = async (ctx) => {
    const message = {
        type: 'get-game',
        game: {
            id: 1
        },
        from: {
            id: ctx.from.id,
            username: ctx.from.username
        }
    };
    const result = await pubnub.publish({
        channel: "games-api",
        message: message
    });
}

module.exports = command

