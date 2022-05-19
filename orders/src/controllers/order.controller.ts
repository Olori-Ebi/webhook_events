import { Request, Response } from "express";
import errorResponse from "../utils/errorHandler";
import successResponse from "../utils/response";
import {v4} from 'uuid'
import { Order } from "../database/model/Order";
import { Cart } from "../database/model/Cart";

export default class OrdersController {
    static async addProductToCart(userId: string, data: any, quantity: number) {
    
        try {
            const { _id, name, price, banner, isRemove } = data;
            const cart = await Cart.findOne({customerId: userId});
            console.log(cart);
            
            const product = { _id, name, price, banner }
            
              if(cart && cart.items.length > 0){
                let isExist = false;
                cart.items.map(item => {
                    if(item.product._id.toString() === product._id.toString()){
                        if(isRemove){
                            cart && cart.items.splice(cart.items.indexOf(item), 1);
                        } else {
                            item.unit = quantity;
                        }
                        isExist = true;
                    }
                });
    
                if(!isExist && !isRemove){
                    cart.items.push({product, unit: quantity});
                } 
            }else{
                return await Cart.create({
                    customerId: userId,
                    items: [{product, unit: quantity}]
                })
            }
            console.log(cart);
            await cart.save();
          } catch (error: any) {
            
          }
      }
      

    static async createOrder(req: Request, res: Response) {
    const { id } = req.user;
    const { txnId } = req.body;
    const result = await OrdersController.addOrder(id, txnId);
    console.log(result);
    
    // const 
    res.status(200).json({
        message: 'Order added successfully',
        result
    })
    }

  static async addOrder(userId:string, txnId:string) {
    try {
        // const { id } = req.user;
        // const { txnId } = req.body;
        console.log(userId, txnId);
        
        const cart = await Cart.findOne({customerId: userId});
        console.log(cart);
        
        if(cart && cart.items.length > 0) {
            let amount = 0;
            cart.items.map(item => {
                amount += (+item.product.price * +item.unit)
            })
            console.log(amount);
            
            const orderId = v4();
        
            const order = new Order({
                orderId,
                customerId: userId,
                amount,
                txnId,
                status: 'received',
                items: cart.items
            })

            cart.items = [];
            const  orderResult = await order.save();
           return orderResult;
            // customer.orders.push(orderResult);

            // await customer.save();
            // return successResponse(res, customer, "Order successfully placed", 200);
        } else {
            // return successResponse(res, customer, "You have no product in cart", 200);
        }
    } catch (error: any) {
        // return errorResponse(
        //     res,
        //     `Error placing order: ${error.message}`,
        //     400,
        //     true
        //   );
    }
  }

  static async AppEventTrigger(req: Request, res: Response) {
    const { payload } = req.body;
    console.log('reached app event trigger',payload);
    

    OrdersController.SubscribeEvents(payload);

    console.log("===============  Order Service Received Event ====== ");
    return res.status(200).json(payload);
  }

  static async GetOrderPayload(userId: string, order: any, event: string) {
    if (order) {
      const payload = {
        event,
        data: { userId, order },
      }

      return payload;
    } else {
      return {message: 'No order is available'}
    }
  }

  static async SubscribeEvents(payload: any) {
    const { event, data } = payload;
    const { userId, product, quantity } = data;

    switch (event) {
    //   case "ADD_TO_WISHLIST":
    //   case "REMOVE_FROM_WISHLIST":
        
    //     OrdersController.addProductToWishlist(userId, product);
    //     break;
      case "ADD_TO_CART":
        console.log('herreeee');
        OrdersController.addProductToCart(userId, product, quantity);
        break;
      case "TESTING":
        console.log("WOEKING")
        break;
      default:
        break;
    }
  }
}
