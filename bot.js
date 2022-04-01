require('dotenv').config()
const { Telegraf } = require('telegraf')
const {getAvailableCommands} = require("./api.services");
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, )

if(process.env.NODE_ENV === 'production') {
    bot.telegram.setWebhook(`${process.env.URL}/bot${process.env.TELEGRAM_BOT_TOKEN}`)
    bot.startWebhook(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, null, process.env.PORT)
}

let commands = [];

bot.launch().then(async () => {
    commands = await getAvailableCommands()
    console.log(commands)
});

module.exports = {
    bot,
    commands
}