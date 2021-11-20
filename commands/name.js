const bot = require('../bot')
const { changePlayerName } = require('../api.services')

const command = async (ctx) => {
    let name = ''
    await bot.telegram.sendMessage(ctx.chat.id, '¿Qué nombre quieres que guarde para ti?', {
        reply_markup: {
            force_reply: true
        }
    })

    bot.on('text', async ctx => {
        if(name === '') {
            name = ctx.message.text
            await changePlayerName(ctx.from.id, name)
        }
    })
}

module.exports = command