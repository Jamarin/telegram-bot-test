const {Scenes} = require('telegraf');
const {initializePlayer} = require("../api.services");

const initPlayerWizard = () => {
    let playerName = ''

    const validateName = (name) => {
        return name.length > 2 && name.length < 255
    }
    const receiveName = (ctx, name) => {
        if(validateName(name)) {
            playerName = name
            return true
        } else {
            ctx.reply('El nombre no puede contener menos de 2 letras ni más de 255.')
            return false
        }
    }

    return new Scenes.WizardScene(
        'init-player-wizard',
        async (ctx) => {
            await ctx.reply('¿Cómo quieres que te llame?')
            return ctx.wizard.next()
        },
        async (ctx) => {
            if(receiveName(ctx, ctx.message.text)) {
                console.log(ctx.from)
                await initializePlayer(ctx.from, playerName)
                await ctx.reply(`De acuerdo, te llamaré ${playerName}.`)
                return ctx.scene.leave()
            }
        }
    )
}

module.exports = initPlayerWizard