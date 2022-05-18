import { Application } from "express";
import ProductController from "./controllers/product.controller";

export default (app: Application) => {
  app.use("/app-events", ProductController.AppEventTrigger)
};
