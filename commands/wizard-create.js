const {Markup, Scenes} = require('telegraf');
const {createGame, addPlayerToGame} = require("../api.services");
const Calendar = require('telegraf-calendar-telegram');
const bot = require('../bot')

const createGameWizard = () => {
    const game = {
        title: '',
        description: '',
        date: new Date(),
        type: '',
        maxPlayers: 0
    }

    const validateTitle = (title) => {
        return title.length > 3 && title.length < 255
    }
    const receiveGameTitle = (ctx, title) => {
        if(validateTitle(title)) {
            game.title = title
            return true
        } else {
            ctx.reply('El título no es válido. Por favor, vuelve a introducirlo. (3 < nombre < 255)')
            return false
        }
    }

    const validateDescription = (description) => {
        return description.length > 3 && description.length < 255
    }
    const receiveGameDescription = (ctx, description) => {
        if(validateDescription(description)) {
            game.description = description
            return true
        } else {
            ctx.reply('La descripción no es válida. Por favor, vuelve a introducirla. (3 < descripción < 255)')
            return false
        }
    }

    const validateDate = (date) => {
        const day = date.split('/')[0]
        const month = date.split('/')[1]
        const year = date.split('/')[2]
        console.log('Let\'s build a date')
        const proposedDate = new Date(year, month - 1, day)
        console.log(`Proposed date: ${proposedDate} divided: ${day}, ${month}, ${year}`)
        return proposedDate > new Date()
    }
    const receiveGameDate = (ctx, date) => {
        if(validateDate(date)) {
            const day = date.split('/')[0]
            const month = date.split('/')[1]
            const year = date.split('/')[2]
            game.date = new Date(year, month - 1, day)
            return true
        } else {
            ctx.reply('La fecha no es válida. Por favor, vuelve a introducirla. (fecha > hoy)')
            return false
        }
    }

    const validateTime = (time) => {
        return time.length === 5 && time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    }

    const receiveGameTime = (ctx, time) => {
        if(validateTime(time)) {
            game.date.setHours(time.substring(0, 2))
            game.date.setMinutes(time.substring(3, 5))
            game.date.setSeconds(0);
            return true
        } else {
            ctx.reply('La hora no es válida. Por favor, vuelve a introducirla. (HH:MM)')
            return false
        }
    }

    return new Scenes.WizardScene(
        'create-game-wizard',
        async (ctx) => {
            await ctx.reply('¿Cuál es el nombre de la partida?')
            return ctx.wizard.next()
        },
        async (ctx) => {
            if(receiveGameTitle(ctx, ctx.message.text)) {
                await ctx.reply('¿Cuál es la descripción de la partida?')
                return ctx.wizard.next()
            }
        },
        async (ctx) => {
            if(receiveGameDescription(ctx, ctx.message.text)) {
                await ctx.reply('¿Qué tipo de partida es?',
                    Markup.inlineKeyboard([[{
                        text: `Rol`,
                        callback_data: `role`
                    }], [{
                        text: `Mesa`,
                        callback_data: `board`
                    }]])
                )
                return ctx.wizard.next()
            }
        },
        async (ctx) => {
            game.type = ctx.callbackQuery.data
            await ctx.reply('Número máximo de jugadores')
            return ctx.wizard.next()
        },
        async (ctx) => {
            game.maxPlayers = parseInt(ctx.message.text)
            game.authorId = ctx.from.id
            await ctx.reply('Fecha de la partida (formato DD/MM/AAAA) -> Ejemplo: 04/02/2022')
            return ctx.wizard.next()
        },
        async (ctx) => {
            if(receiveGameDate(ctx, ctx.message.text)) {
                await ctx.reply('Hora de la partida (formato HH:MM) -> Ejemplo: 17:30')
                return ctx.wizard.next()
            }
        },
        async(ctx) => {
            if(receiveGameTime(ctx, ctx.message.text)) {
                const createdGame = await createGame(game)
                await ctx.reply(`La partida ${createdGame.title} ha sido creada con éxito.`)
                await addPlayerToGame(createdGame.id, ctx.from)
                return await ctx.scene.leave()
            }
        }
    )
}

module.exports = createGameWizard