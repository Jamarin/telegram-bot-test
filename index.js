const bot = require('./bot')
const commandStart = require('./commands/start')
const commandInit = require('./commands/init')
const commandGames = require('./commands/games')
const commandMe = require('./commands/me')
const commandCreateGame = require('./commands/create')

bot.command('start', ctx => {
    console.log('start')
    commandStart(ctx)
})

bot.command('init', ctx => {
    commandInit(ctx)
})

bot.command('games', ctx => {
    commandGames(ctx)
})

bot.command('me', ctx => {
    commandMe(ctx)
})

bot.command('create', ctx => {
    commandCreateGame(ctx)
})
