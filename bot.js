require('dotenv').config()
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

bot.launch().then(async () => {

});

module.exports = bot