const bot = require('../bot');

const command = async (ctx) => {
    await bot.telegram.sendMessage(ctx.chat.id, '¿Qué sugerencia tienes?', {
        reply_markup: {
            force_reply: true
        }
    })

    bot.on('text', async ctx => {
        await bot.telegram.sendMessage(process.env.CHAT_OWNER_ID, ctx.message.text)
        ctx.reply('¡Gracias por tu sugerencia!')
    })
}

module.exports = command