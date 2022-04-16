const {pubnub} = require("./helpers/pubnub-helper");
const aName = require("./answers/a-name");

const initializeWorker = (bot) => {
    pubnub.addListener({
        message: async function (messageEvent) {
            switch(messageEvent.message.type) {
                case "update-name": {
                    aName(messageEvent.message);
                    break;
                }
            }
        }
    });

    pubnub.subscribe({
        channels: ["games-front"],
    });
}

module.exports = {
    initializeWorker
}
