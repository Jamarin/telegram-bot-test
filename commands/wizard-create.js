const {Markup, Scenes} = require('telegraf');
const {createGame} = require("../api.services");

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

    return new Scenes.WizardScene(
        'super-wizard',
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
            const createdGame = await createGame(game)
            await ctx.reply(`La partida ${createdGame.title} ha sido creada con éxito.`)
            return await ctx.scene.leave()
        }
    )
}

module.exports = createGameWizard