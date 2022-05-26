// /* ******************************* message broker********************************* */
// import amqplib from "amqplib";
// import { EXCHANGE_NAME, MESSAGE_BROKER_URL, QUEUE_NAME } from "../config";

// // create a channel
// export const CreateChannel = async () => {
//   try {
//     const connection = await amqplib.connect(MESSAGE_BROKER_URL);
//     const channel = await connection.createChannel();
//     await channel.assertExchange(EXCHANGE_NAME, "direct");
//     return channel;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// // publish message
// export const publishMessage = async (channel, binding_key, message) => {
//   try {
//     await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// // subscribe message
// export const subscribeMessage = async (channel, service, binding_key) => {
//   const appQueue = await channel.assertQueue(QUEUE_NAME);
//   channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
//   channel.consume(appQueue.queue, data => {
//     console.log('received data');
//     console.log(data.content.toString());
//     channel.ack(data)
//   })
// };
