const bot = require('../bot')

const command = (ctx) => {
    console.log('start')
    bot.telegram.sendMessage(ctx.chat.id, `Bienvenido al bot de Valentia Lúdica para la gestión de partidas.
- /init definir tu nombre
- /name cambiar tu nombre
- /me - ver las partidas en las que participas
- /games - ver todas las partidas
- /create - crear partida
- /help - ver ayuda
.`)
}

module.exports = command