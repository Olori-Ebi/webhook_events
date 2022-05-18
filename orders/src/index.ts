import express from "express";
import dotenv from "dotenv";
import App from "./express-app";
import { PORT } from "./config";
import dbConnection from "./database/dbConnection";

dotenv.config();

const StartServer = async () => {
  const app = express();

  dbConnection()
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => console.log(err));

  await App(app);

  app
    .listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit(1);
    });
};

StartServer();
