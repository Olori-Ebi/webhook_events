import express from "express";
import OrdersController from "../controllers/order.controller";
// import OrdersController from "../controllers/order.controller";
import { verifyUser } from '../middleware/authentication';

const orderRouter = express.Router();

orderRouter.post("/create", verifyUser, OrdersController.createOrder);


export default orderRouter;