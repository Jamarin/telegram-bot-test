/* eslint-disable @typescript-eslint/no-floating-promises */
require('dotenv').config()
const { Composer, Markup, Scenes, session, Telegraf } = require('telegraf')

const token = process.env.TELEGRAM_BOT_TOKEN
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}



const bot = new Telegraf(token)
const stage = new Scenes.Stage([superWizard], {
    createGame: 'super-wizard',
})

bot.use(session())
bot.use(stage.middleware())
bot.command('wizard', ctx => {
    ctx.scene.enter('super-wizard');
})
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))