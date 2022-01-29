const {getGames, getPlayerListInGame, getPlayerInGame, removePlayerFromGame, addPlayerToGame, cancelGame} = require("../api.services");
const bot = require('../bot')
const {isNumber} = require("util");

let gamesList = []
let gamesListButtons = []
let gameActionsButtons = []

const validateMaxTime = (time) => {
    if(isNumber(time)){
        if(time > 0 && time < 365){
            return true
        }
    }
}

const command = async (ctx) => {
    let gamesFilter = {
        'type': '',
        'maxTime': 14,
    }
    if(ctx.message.text.length > 6) {
        // Check for parameters
        let params = ctx.message.text.split(" ")
        if(params[1].toLowerCase() === 'rol') {
            gamesFilter.type = 'role'
        } else if(params[1].toLowerCase() === 'mesa') {
            gamesFilter.type = 'board'
        }

        if(gamesFilter.type !== '' && params.length > 2) {
            gamesFilter.maxTime = parseInt(params[2])
            if(!validateMaxTime(gamesFilter.maxTime)){
                gamesFilter.maxTime = 14
            }
        }
        if(gamesFilter.type === '' && params.length === 2) {
            gamesFilter.maxTime = parseInt(params[1])
            if(!validateMaxTime(gamesFilter.maxTime)){
                gamesFilter.maxTime = 14
            }
        }
    }
    gamesList = await getGames(gamesFilter)
    await prepareGamesButtons()
    if(gamesList.length === 0) {
        await ctx.reply('No existen partidas disponibles. Puedes crear las tuyas propias con el comando /create');
    } else {
        await bot.telegram.sendMessage(ctx.from.id, "Elige la partida que quieras gestionar", {
            reply_markup: {
                inline_keyboard: prepareRenderGamesButtons()
            }
        })
    }
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
    if (!isPlayerInGame && game.authorId !== playerData.id) {
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
    } else if(playerData.id === game.authorId) {
        gameActionsButtons.push({
            text: 'Cancelar',
            callback_data: `game-cancel-${game.id}`
        })
        bot.action(`game-cancel-${game.id}`, async ctx => {
            const response = await cancelGame(game.id, ctx.from.id)
            if(response.gameCanceled) {
                if(response.playersList.length > 0) {
                    response.playersList.forEach(player => {
                        bot.telegram.sendMessage(player.id, `La partida ${game.title} ha sido cancelada.`)
                    })
                }
                ctx.answerCbQuery()
            }
            ctx.reply(`La partida ${game.title} ha sido cancelada. Se avisará a los usuarios que estuvieran apuntados.`)
            ctx.answerCbQuery()
        })
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
Capacidad: ${game.players.length} / ${game.maxPlayers}
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