
class RabbitMQHelper {
  rabbitMQClient: any;

  constructor (rabbitMQClient: any) {
    this.rabbitMQClient = rabbitMQClient;
  }

  publish (data: any, queue: any, errorCallback: any) {
    return this.rabbitMQClient.then((connection: any) => connection.createChannel())
        .then((channel: any) => channel.assertQueue(queue, { durable: true, noAck: false })
            .then((ok: any) => {
              const response = channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
              channel.close();
              return new Promise((resolve, reject) => resolve(response));
            }))
        .catch((err: any) => {
          console.warn(err);

          if (errorCallback) {
            errorCallback(err);
          }
        });
  }

  consume(queue: any) {
    return this.rabbitMQClient.then((connection: any) => connection.createChannel())
      .then((channel: any) => {
        channel.prefetch(1);
        channel.assertQueue(queue, { durable: true, noAck: false })
          .then(() => channel.consume(queue, (message: any) => {
            if (message) {
              console.log('received');
              console.log(message.content.toString());
              channel.ack(message);
              return new Promise((resolve, reject) => {
                resolve({
                  msg: message.content.toString(),
                  msg_obj: message,
                  channel,
                });
              });
            }
            return null;
          }));
      });
  }

}

module.exports = RabbitMQHelper;
