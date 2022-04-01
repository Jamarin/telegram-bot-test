const {bot} = require('../bot')
const { getGamesByPlayerId, getGames, getPlayerInGame, addPlayerToGame, removePlayerFromGame, getPlayerListInGame} = require('../api.services')

let gamesList = []
let gamesListButtons = []
let gameActionsButtons = []

const command = async (ctx) => {
    gamesList = await getGamesByPlayerId(ctx.from.id)
    if(gamesList.length === 0) {
        await bot.telegram.sendMessage(ctx.from.id, "Actualmente no estás en ninguna partida. Para ver las partidas activas puedes usar el comando /games")
    } else {
        await prepareGamesButtons()
        await bot.telegram.sendMessage(ctx.from.id, "Estas son las partidas en las que estás. Elige la partida que quieras gestionar", {
            reply_markup: {
                inline_keyboard: prepareRenderGamesButtons()
            }
        })
    }
}
const prepareGamesButtons = async () => {
    gamesListButtons = []
    gamesList.forEach(({game}) => {
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
    if (!isPlayerInGame) {
        gameActionsButtons.push({
            text: 'Unirse',
            callback_data: `game-in-${game.id}`
        })
        bot.action(`game-in-${game.id}`, ctx => {
            addPlayerToGame(game.id, ctx.from)
            bot.telegram.sendMessage(ctx.from.id, `Te has unido a la partida ${game.title}`)
            ctx.answerCbQuery()
        })
    } else {
        gameActionsButtons.push({
            text: 'Salir',
            callback_data: `game-out-${game.id}`
        })
        bot.action(`game-out-${game.id}`, ctx => {
            removePlayerFromGame(game.id, ctx.from.id)
            bot.telegram.sendMessage(ctx.from.id, `Te has salido de la partida ${game.title}`)
            ctx.answerCbQuery()
        })
    }
}

const prepareGameActionsButtons = (game) => {
    bot.action(`game-${game.id}`, async ctx => {
        await prepareGameActionsButtonsForPlayer(ctx.from, game)
        let playersText = ""
        const players = await getPlayerListInGame(game.id)
        if (players !== undefined && players.length > 0) {
            for(const player of players) {
                playersText += `- ${player.desiredName}
`
            }
        } else {
            playersText = '- '
        }
        bot.telegram.sendMessage(ctx.from.id, `${game.title}
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
