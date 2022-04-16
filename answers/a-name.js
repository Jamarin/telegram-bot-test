const {bot} = require('../bot')

const aName = (res) => {
    bot.telegram.sendMessage(res.from.id, `A partir de ahora tu nombre será ${res.name}`);
}

module.exports = aName;
