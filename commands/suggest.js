const bot = require('../bot');

const command = async (ctx) => {
    await bot.telegram.sendMessage(ctx.chat.id, '¿Qué sugerencia tienes?', {
        reply_markup: {
            force_reply: true
        }
    })

    bot.on('text', async ctx => {
        let sentFrom = ctx.message.from.username;
        if(sentFrom === null || sentFrom === undefined || sentFrom === '') {
            sentFrom = ctx.message.from.first_name;
        }
        if(sentFrom === null || sentFrom === undefined || sentFrom === '') {
            sentFrom = ctx.message.from.id;
        }
        await bot.telegram.sendMessage(process.env.CHAT_OWNER_ID, `Sugerencia desde VL Bot, enviada por ${ctx.from.username}: ${ctx.message.text}`)
        ctx.reply('¡Gracias por tu sugerencia!')
    })
}

module.exports = command