import { Application } from "express";
import CustomerController from "./controllers/customer.controller";

export default (app: Application) => {
  app.use("/app-events", CustomerController.AppEventTrigger)
};
