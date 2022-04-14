const { publish, listen } = require('../helpers/amqp-helper');

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
    const queue = 'games-api';
    publish(message, queue);
    const response = listen()
    console.log(response);
    if(response !== null) {
        ctx.reply(`El juego solicitado es ${response.game.name}`);
    } else {
        ctx.reply(`Waiting...`);
    }
}

module.exports = command
