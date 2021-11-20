const bot = require('./bot')
const {Scenes, session} = require('telegraf')
const commandStart = require('./commands/start')
const commandInit = require('./commands/init')
const commandGames = require('./commands/games')
const commandMe = require('./commands/me')
const commandHelp = require('./commands/help')
const commandName = require('./commands/name')
const createGameWizard = require('./commands/wizard-create')

// Prepare stage
const stage = new Scenes.Stage([createGameWizard()], {
    createGame: 'create-game-wizard',
})

bot.use(session())
bot.use(stage.middleware())

bot.command('start', ctx => {
    commandStart(ctx)
})

bot.command('help', ctx => {
    commandHelp(ctx)
})

bot.command('init', ctx => {
    commandInit(ctx)
})

bot.command('name', ctx => {
    commandName(ctx)
})

bot.command('games', ctx => {
    commandGames(ctx)
})

bot.command('me', ctx => {
    commandMe(ctx)
})

bot.command('create', ctx => {
    ctx.scene.enter('super-wizard');
})