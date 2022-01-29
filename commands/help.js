const bot = require('../bot')

const command = (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, `Esta es la ayuda del bot de Valentia Lúdica:
- /init definir tu nombre
- /name cambiar tu nombre
- /me - ver las partidas en las que participas
- /games - ver todas las partidas
- /create - crear partida
- /help - ver ayuda
- /suggest - enviar sugerencias

Si necesitas más ayuda, contacta con junta@valentialudica.com`)
}

module.exports = command