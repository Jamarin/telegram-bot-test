const bot = require('../bot')

const command = (ctx) => {
    console.log('start')
    bot.telegram.sendMessage(ctx.chat.id, `Bienvenido al bot de Valentia Lúdica para la gestión de partidas.
Para poder comenzar a gestionar tus partidas desde aquí, necesitaré que me indiques qué nombre quieres que aparezca cuando te incluyas en una partida mediante el comando /init tunombre.
Puedes utilizar el comando /name tunombre para modificar este nombre en cualquier momento.
Adicionalmente, puedes utilizar el comando /help para obtener un listado de los comandos existentes, así como una explicación de cada uno de ellos.
Para cualquier duda adicional, puedes contactar con la junta de Valentia Lúdica en junta@valentialudica.com y ellos se encargarán de resolverla.`)
}

module.exports = command