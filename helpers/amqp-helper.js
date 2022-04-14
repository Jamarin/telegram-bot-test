const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';
const amqp = require('amqplib/callback_api');

const publish = (message, queue) => {
    amqp.connect(AMQP_URL, function(err, conn) {
            if (err != null) console.error(err);
            conn.createChannel(function(err, ch) {
                if (err != null) console.error(err);
                ch.assertQueue(queue, { durable: true });
                ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
                console.log(" [x] Sent %s", message);
            });
        });
}

const listen = () => {
    let message = null;
    amqp.connect(AMQP_URL, function(err, conn) {
            if (err != null) console.error(err);
            conn.createChannel(function(err, ch) {
                if (err != null) console.error(err);
                ch.assertQueue('games-front', { exclusive: false }, function(err, q) {
                    if (err != null) console.error(err);
                    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
                    ch.consume(q.queue, function(msg) {
                        console.log(" [x] Received %s", msg.content.toString());
                        message = JSON.parse(msg.content.toString())
                        return message;
                    }, { noAck: true });
                });
            });
        });
}

module.exports = {
    publish,
    listen
}
