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

    return new Scenes.WizardScene(
        'super-wizard',
        async (ctx) => {
            await ctx.reply('¿Cuál es el nombre de la partida?')
            return ctx.wizard.next()
        },
        async (ctx) => {
            game.title = ctx.message.text
            await ctx.reply('¿Cuál es la descripción de la partida?')
            return ctx.wizard.next()
        },
        async (ctx) => {
            game.description = ctx.message.text
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