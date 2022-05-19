import { Request, Response } from "express";
import { v4 } from "uuid";
import { Order } from "../database/model/Order";
import { Cart } from "../database/model/Cart";
import { PublishCustomerEvents } from "../../../products/src/utils";

export default class OrdersController {
  static async addProductToCart(userId: string, data: any, quantity: number) {
      const { _id, name, price, banner, isRemove } = data;
      const cart = await Cart.findOne({ customerId: userId });

      const product = { _id, name, price, banner };

      if (cart && cart.items.length > 0) {
        let isExist = false;
        cart.items.map((item) => {
          if (item.product._id.toString() === product._id.toString()) {
            if (isRemove) {
              cart && cart.items.splice(cart.items.indexOf(item), 1);
            } else {
              item.unit = quantity;
            }
            isExist = true;
          }
        });

        if (!isExist && !isRemove) {
          cart.items.push({ product, unit: quantity });
        }
      } else {
        return await Cart.create({
          customerId: userId,
          items: [{ product, unit: quantity }],
        });
      }
      await cart.save();
  }

  static async createOrder(req: Request, res: Response) {
    const { id } = req.user;
    const { txnId } = req.body;
    const result = await OrdersController.addOrder(id, txnId);

    res.status(200).json({
      message: "Order added successfully",
      result,
    });
  }

  static async addOrder(userId: string, txnId: string) {
    const cart = await Cart.findOne({ customerId: userId });
    if (cart && cart.items.length > 0) {
      let amount = 0;
      cart.items.map((item) => {
        amount += +item.product.price * +item.unit;
      });

      const orderId = v4();

      const order = new Order({
        orderId,
        customerId: userId,
        amount,
        txnId,
        status: "received",
        items: cart.items,
      });
      console.log("gotten here");

      const result = (await OrdersController.GetOrderPayload(
        userId,
        { orderId, amount },
        "CREATE_ORDER"
      )) as any;
      console.log("result", result);

      await PublishCustomerEvents(result);

      cart.items = [];
      const orderResult = await order.save();
      return orderResult;
    } else {
      return "error";
    }
  }

  static async GetProductPayload(userId: string, data: any, event: string) {
    const { productId, quantity, isRemove } = data;
    const product = await Order.findById(productId);
    if (product) {
      const payload = {
        event,
        data: { userId, quantity, product, isRemove },
      };

      return payload;
    }
  }

  static async AppEventTrigger(req: Request, res: Response) {
    const { payload } = req.body;

    OrdersController.SubscribeEvents(payload);

    console.log("===============  Order Service Received Event ====== ");
    return res.status(200).json(payload);
  }

  static async GetOrderPayload(userId: string, order: any, event: string) {
    if (order) {
      const payload = {
        event,
        data: { userId, order, event },
      };
      return payload;
    }
  }

  static async SubscribeEvents(payload: any) {
    const { event, data } = payload;
    const { userId, product, quantity } = data;

    switch (event) {
      case "ADD_TO_CART":
        console.log("herreeee");
        OrdersController.addProductToCart(userId, product, quantity);
        break;
      case "TESTING":
        console.log("WORKING");
        break;
      default:
        break;
    }
  }
}
