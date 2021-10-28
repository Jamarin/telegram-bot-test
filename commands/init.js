const {initializePlayer} = require("../api.services");
const bot = require('../bot')

const command = (ctx) => {
    const name = ctx.message.text.slice(6)
    console.log(name)
    initializePlayer(ctx.from, name)
    bot.telegram.sendMessage(ctx.chat.id, `Se ha establecido ${name} como el nombre que aparecerá cuando te inscribas en alguna partida.`)
}

module.exports = command