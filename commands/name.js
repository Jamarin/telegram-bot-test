const {bot} = require('../bot')
const { changePlayerName } = require('../api.services')

const command = async (ctx) => {
    await bot.telegram.sendMessage(ctx.chat.id, '¿Qué nombre quieres que guarde para ti?', {
        reply_markup: {
            force_reply: true
        }
    })

    bot.on('text', async ctx => {
        if(ctx.message.text !== '') {
            name = ctx.message.text
            ctx.reply(`A partir de ahora, tu nombre será ${name}`)
            await changePlayerName(ctx.from.id, name)
        }
    })
}

module.exports = command
