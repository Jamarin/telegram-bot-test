const {getGames, getPlayerListInGame, getPlayerInGame, removePlayerFromGame, addPlayerToGame, cancelGame} = require("../api.services");
const bot = require('../bot')

let gamesList = []
let gamesListButtons = []
let gameActionsButtons = []

const command = async (ctx) => {
    gamesList = await getGames()
    await prepareGamesButtons()
    await bot.telegram.sendMessage(ctx.from.id, "Elige la partida que quieras gestionar", {
        reply_markup: {
            inline_keyboard: prepareRenderGamesButtons()
        }
    })
}

const prepareGamesButtons = async () => {
    gamesListButtons = []
    gamesList.forEach((game) => {
        gamesListButtons.push({
            text: `${game.title} - ${new Date(game.date).toLocaleString('es')}`,
            callback_data: `game-${game.id}`
        })

        prepareGameActionsButtons(game)
    })
}

const prepareGameActionsButtonsForPlayer = async (playerData, game) => {
    gameActionsButtons = []
    const isPlayerInGame = await getPlayerInGame(playerData.id, game.id)
    const players = await getPlayerListInGame(game.id)
    if (!isPlayerInGame) {
        if (players.length >= game.maxPlayers) {
            gameActionsButtons.push({
                text: 'Partida llena',
                callback_data: 'full-game'
            })
            bot.action('full-game', ctx => {
                bot.telegram.sendMessage(ctx.chat.id, 'La partida seleccionada está llena. ¿Quieres que te avisemos si se queda un hueco libre? (WIP)')
                ctx.answerCbQuery()
            })
        }
        else {
            if(playerData.id === game.authorId) {
                gameActionsButtons.push({
                  text: 'Cancelar',
                  callback_data: `game-cancel-${game.id}`
                })
                bot.action(`game-cancel-${game.id}`, ctx => {
                    cancelGame(game.id, ctx.from.id)
                    ctx.reply(`La partida ${game.title} ha sido cancelada. Se avisará a los usuarios que estuvieran apuntados. (WIP)`)
                    ctx.answerCbQuery()
                })
            } else {
                gameActionsButtons.push({
                    text: 'Unirse',
                    callback_data: `game-in-${game.id}`
                })
                bot.action(`game-in-${game.id}`, ctx => {
                    addPlayerToGame(game.id, ctx.from)
                    bot.telegram.sendMessage(ctx.chat.id, `Te has unido a la partida ${game.title}`)
                    ctx.answerCbQuery()
                })
            }
        }
    } else {
        gameActionsButtons.push({
            text: 'Salir',
            callback_data: `game-out-${game.id}`
        })
        bot.action(`game-out-${game.id}`, ctx => {
            removePlayerFromGame(game.id, ctx.from.id)
            bot.telegram.sendMessage(ctx.chat.id, `Te has salido de la partida ${game.title}`)
            ctx.answerCbQuery()
        })
    }
}

const prepareGameActionsButtons = (game) => {
    bot.action(`game-${game.id}`, async ctx => {
        await prepareGameActionsButtonsForPlayer(ctx.from, game)
        let playersText = ""
        game.players = await getPlayerListInGame(game.id)
        if (game.players !== undefined && game.players.length > 0) {
            for(const player of game.players) {
                playersText += `- ${player.desiredName}
`
            }
        } else {
            playersText = '- '
        }
        bot.telegram.sendMessage(ctx.chat.id, `${game.title}
------------------------------
${game.description}
Fecha: ${new Date(game.date).toLocaleString('es')}
Huecos (sin contar creador): ${game.maxPlayers}
Jugadores apuntados:
${playersText}`,
            {
                reply_markup: {
                    inline_keyboard: prepareRenderActionsGameButtons()
                }
            })
        ctx.answerCbQuery()
    })
}

const prepareRenderGamesButtons = () => {
    const arrayOfButtons = []
    gamesListButtons.forEach((btn, idx) => {
        arrayOfButtons.push([])
        arrayOfButtons[idx].push(btn)
    })
    return arrayOfButtons
}

const prepareRenderActionsGameButtons = () => {
    const arrayOfButtons = []
    gameActionsButtons.forEach((btn, idx) => {
        arrayOfButtons.push([])
        arrayOfButtons[idx].push(btn)
    })
    return arrayOfButtons
}

module.exports = command