import { Application } from "express";
import OrdersController from "./controllers/order.controller";

export default (app: Application) => {
  app.use("/app-events", OrdersController.AppEventTrigger)
};
