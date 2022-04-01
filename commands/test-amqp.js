const command = async (ctx) => {
    require('amqplib/callback_api')
        .connect('amqps://nhiqhejo:DzzAKXV_2WC3zIeSS_RAtOtgICGpX7Ek@squid.rmq.cloudamqp.com/nhiqhejo', function(err, conn) {
            if (err != null) console.error(err);
            publisher(conn);
            listener(conn);
        });
}

const publisher = (conn) => {
    conn.createChannel((err, ch) => {
        if (err != null) console.error(err);
        ch.assertQueue('games-api');
        const message = {
            game: {
                id: 1
            }
        };
        ch.sendToQueue('games-api', Buffer.from(JSON.stringify(message)));
    })
}

const listener = (conn) => {
    conn.createChannel((err, ch) => {
        if (err != null) console.error(err);
        ch.assertQueue('games-front');
        ch.consume('games-front', (msg) => {
            console.log(msg.content.toString());
            ch.ack(msg);
        });
    })
}

module.exports = command
