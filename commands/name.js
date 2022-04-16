const {bot} = require('../bot')
const {publish} = require('../helpers/pubnub-helper');

const command = async (ctx) => {
    await bot.telegram.sendMessage(ctx.chat.id, '¿Qué nombre quieres que guarde para ti?', {
        reply_markup: {
            force_reply: true
        }
    })

    bot.on('text', async ctx => {
        if(ctx.message.text !== '') {
            publish('games-api', {
                type: 'update-name',
                from: ctx.from,
                name: ctx.message.text
            })
        }
    })
}

module.exports = command
