const {bot, commands} = require('./bot')
const {Scenes, session} = require('telegraf')
const commandStart = require('./commands/start')
const commandGames = require('./commands/games')
const commandMe = require('./commands/me')
const commandHelp = require('./commands/help')
const commandName = require('./commands/name')
const createGameWizard = require('./commands/wizard-create')
const initPlayerWizard = require('./commands/init')
const commandSuggest = require('./commands/suggest')
const commandPubNub = require('./commands/test-pubnub')
const {playerExists} = require("./api.services");
const {initializeWorker} = require('./worker');

const checkCommandIsActive = (command) => {
    const res = commands.filter(c => c.name === command).map(c => c.active = true)
    console.log(res)
    return res;
}

// Prepare stage
const stage = new Scenes.Stage([createGameWizard(), initPlayerWizard()], {
    createGame: 'create-game-wizard',
    initPlayer: 'init-player-wizard'
})

bot.use(session())
bot.use(stage.middleware())

initializeWorker(bot)

bot.command('pubnub', ctx => {
    commandPubNub(ctx)
})

bot.command('start', ctx => {
    commandStart(ctx)
})

bot.command('help', ctx => {
    commandHelp(ctx)
})

bot.command('init', async ctx => {
    if(await checkUserExists(ctx.from)) {
        ctx.reply('Ya has iniciado tu cuenta antes.');
    } else {
        await ctx.scene.enter('init-player-wizard')
    }

})

bot.command('name', async ctx => {
    if(!await checkUserExists(ctx.from)) {
        ctx.reply('Antes de cambiar tu nombre debes iniciar tu cuenta con el comando /init');
    } else {
       await commandName(ctx)
    }
})

bot.command('games', async ctx => {
    if(!await checkUserExists(ctx.from)) {
        ctx.reply('Antes de listar las partidas debes iniciar tu cuenta con el comando /init');
    } else {
        await commandGames(ctx)
    }
})

bot.command('me', async ctx => {
    if(!await checkUserExists(ctx.from)) {
        ctx.reply('Antes de listar tus partidas debes iniciar tu cuenta con el comando /init');
    } else {
        await commandMe(ctx)
    }
})

bot.command('create', async ctx => {
    if(!await checkUserExists(ctx.from)) {
        ctx.reply('Antes de crear una partida debes iniciar tu cuenta con el comando /init');
    } else {
        await ctx.scene.enter('create-game-wizard');
    }
})

bot.command('suggest', async ctx => {
    await commandSuggest(ctx)
})

/* SCHEDULED TASKS */
const schedule = require('node-schedule')
schedule.scheduleJob(process.env.SCHEDULE_GAMES_MESSAGE, async () => {
    console.log('Running scheduled task to send daily message about games');

    bot.telegram.sendMessage(process.env.TELEGRAM_BOARD_GROUP_ID, 'Hola, esta es una prueba de envio de mensajes');
    bot.telegram.sendMessage(process.env.TELEGRAM_ROLE_GROUP_ID, 'Hola, esta es una prueba de envio de mensajes');
})

const checkUserExists = async (playerData) => {
    return await playerExists(playerData);
}
