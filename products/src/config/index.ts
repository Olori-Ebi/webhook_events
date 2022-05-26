import dotenv from "dotenv";
dotenv.config()

export const MONGO_URI = process.env.MONGO_URI;
export const APP_SECRET = '238745623hsdf'
export const AMQP_URI = process.env.AMQP_URI;
export const PORT = process.env.PORT || 8000;
export const MESSAGE_BROKER_URL = process.env.MESSAGE_BROKER_URL;
export const EXCHANGE_NAME = process.env.EXCHANGE_NAME;
export const QUEUE_NAME = process.env.QUEUE_NAME;
export const SHOPPING_BINDING_KEY = process.env.SHOPPING_BINDING_KEY;
