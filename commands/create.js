const bot = require('../bot')
const { createGame } = require('../api.services')

const game = {
    title: '',
    description: '',
    date: new Date(),
    type: '',
    maxPlayers: 0
}

const gameTypes = {
    'role': 'Rol',
    'board': 'Mesa'
}

const initializeGame = () => {
    game.title = ''
    game.description = ''
    game.date = new Date()
    game.date.setDate(game.date.getDate() + 7);
    game.type = ''
    game.maxPlayers = 0
}

const printGame = async (ctx) => {
    await bot.telegram.sendMessage(ctx.chat.id, `Título: ${game.title}
Descripción: ${game.description}
Fecha: ${new Date(game.date).toLocaleString('es')}
Tipo: ${gameTypes[game.type]}
Huecos: ${game.maxPlayers}`)
}

const prepareTypeButtons = () => {
    return [[{
        text: `Rol`,
        callback_data: `role`
    }], [{
        text: `Mesa`,
        callback_data: `board`
    }]]
}

const endFifthStep = async (ctx) => {
    await printGame(ctx)
    game.authorId = ctx.from.id
    await createGame(game)
    ctx.reply('Tu partida ha sido creada con éxito')
}

const fifthStep = async (ctx) => {
    await bot.telegram.sendMessage(ctx.chat.id, '¿Cuántas personas pueden participar (sin incluirte)?', {
        reply_markup: {
            force_reply: true
        }
    })
}

const endFourthStep = async (ctx) => {
    await printGame(ctx)
    await fifthStep(ctx)
}

const fourthStep = async (ctx) => {
    await bot.telegram.sendMessage(ctx.chat.id, '¿Cuándo tendrá lugar? (WIP)')
    await endFourthStep(ctx)
}

const endThirdStep = async (ctx) => {
    await printGame(ctx)
    ctx.answerCbQuery()
    ctx.editMessageReplyMarkup({
        reply_markup: []
    })
    await fourthStep(ctx)
}

const thirdStep = async (ctx) => {
    await bot.telegram.sendMessage(ctx.chat.id, 'Elige el tipo:', {
        reply_markup: {
            inline_keyboard: prepareTypeButtons()
        }
    })
    bot.action('role', ctx => {
        game.type = 'role'
        endThirdStep(ctx)
    })
    bot.action('board', ctx => {
        game.type = 'board'
        endThirdStep(ctx)
    })

}

const endSecondStep = async (ctx) => {
    await printGame(ctx)
    await thirdStep(ctx)
}

const secondStep = async (ctx) => {
    await bot.telegram.sendMessage(ctx.chat.id, 'A continuación puedes añadir una descripción', {
        reply_markup: {
            force_reply: true
        }
    })
}

const endFirstStep = async (ctx) => {
    await printGame(ctx)
    await secondStep(ctx)
}

const firstStep = async (ctx) => {
    await bot.telegram.sendMessage(ctx.chat.id, 'Procedamos a crear una nueva partida. ¿Cómo se titula?', {
        reply_markup: {
            force_reply: true
        }
    })
}

const prepareAnswers = () => {
    bot.on('text', async ctx => {
        if(game.title === '') {
            game.title = ctx.message.text
            await endFirstStep(ctx)
        } else if(game.description === '') {
            game.description = ctx.message.text
            await endSecondStep(ctx)
        } else if(game.maxPlayers === 0) {
            game.maxPlayers = parseInt(ctx.message.text)
            await endFifthStep(ctx)
        }
    })
}

const command = async (ctx) => {
    if(ctx.chat.type !== 'private') return
    initializeGame()
    prepareAnswers()
    await firstStep(ctx)
}

module.exports = command