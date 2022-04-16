const PubNub = require('pubnub');

const pubnub = new PubNub({
    publishKey: process.env.PubNubPublishKey,
    subscribeKey: process.env.PubNubSubscribeKey,
    uuid: process.env.PubNubUUID,
    secretKey: process.env.PubNubSecretKey
});

module.exports = {
    pubnub,
    publish: (channel, message) => {
        pubnub.publish({
            channel,
            message
        });
    },
};
