import { Request, response, Response } from "express";
import { Product } from "../database/model/Product";
import errorResponse from "../utils/errorHandler";
import successResponse from "../utils/response";
// import { PublishCustomerEvents, PublishOrderEvents } from "../utils/index";
import rabbit from '../database/rabbit'

export default class ProductController {
  static async createProduct(req: Request, res: Response) {
    // rabbit
    try {
      const { name, desc, type, unit, price, available, supplier, banner } =
        req.body;
      const product = new Product({
        name,
        desc,
        type,
        unit,
        price,
        available,
        supplier,
        banner,
      });
      await product.save();
      return successResponse(res, product, "Product created successfully", 201);
    } catch (error: any) {
      return errorResponse(
        res,
        `Error creating a product. ${error.message}`,
        400,
        true
      );
    }
  }

  static async getProducts(_req: Request, res: Response) {
    try {
      const product = await Product.find();
      return successResponse(
        res,
        product,
        "Products fetched successfully",
        200
      );
    } catch (error: any) {
      return errorResponse(
        res,
        `Error fetching products. ${error.message}`,
        400,
        true
      );
    }
  }

  static async getProductCategory(req: Request, res: Response) {
    try {
      const { type } = req.params;
      const product = await Product.find({ type });
      return successResponse(
        res,
        product,
        `Product of type ${type} fetched successfully`,
        200
      );
    } catch (error: any) {
      return errorResponse(
        res,
        `Error fetching products. ${error.message}`,
        400,
        true
      );
    }
  }

  static async AppEventTrigger(req: Request, res: Response) {
    const { payload } = req.body;

    ProductController.SubscribeEvents(payload);

    console.log("===============  Product Service Received Event ====== ");
    return res.status(200).json(payload);
  }

  static async SubscribeEvents(payload: any) {
    const { event, data } = payload;

    const { userId, product, order, qty } = data;

    switch (event) {
      case "TESTING":
        console.log("WOEKING");
        break;
      default:
        break;
    }
  }

  static async addProductToWishlist(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const { productId } = req.body;
      const result = (await ProductController.GetProductPayload(
        id,
        { productId },
        "ADD_TO_WISHLIST"
      )) as any;
      // await PublishCustomerEvents(result);
      let channel = 'PUBLISH_CUSTOMER'
      rabbit(function (conn: any) {
        conn.createChannel(function (err:any, ch:any) {
            if (err) {
                console.log(err);
            }
            ch.assertQueue(channel, { durable: true });
            ch.sendToQueue(channel, Buffer.from(JSON.stringify(result)));
            console.log('gotten');
        });
      });

      return successResponse(
        res,
        result.data.data,
        "Product added to wishlist successfully",
        200
      );
    } catch (error: any) {
      return errorResponse(
        res,
        `Error adding product to wishlist: ${error.message}`,
        400,
        true
      );
    }
  }

  static async addProductToCart(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const { productId, quantity, isRemove } = req.body;

      const result = (await ProductController.GetProductPayload(
        id,
        { productId, quantity, isRemove },
        "ADD_TO_CART"
      )) as any;

      // let channel = 'PUBLISH_CUSTOMER'
      rabbit(function (conn: any) {
        conn.createChannel(function (err:any, ch:any) {
            if (err) {
                console.log(err);
            }
            ch.assertQueue('PUBLISH_CUSTOMER', { durable: true });
            ch.sendToQueue('PUBLISH_CUSTOMER', Buffer.from(JSON.stringify(result)));
        });
    });

    // let channel = 'PUBLISH_ORDER'
    rabbit(function (conn: any) {
      conn.createChannel(function (err:any, ch:any) {
          if (err) {
              console.log(err);
          }
          ch.assertQueue('PUBLISH_ORDER', { durable: true });
          ch.sendToQueue('PUBLISH_ORDER', Buffer.from(JSON.stringify(result)));
      });
  });
      // await PublishCustomerEvents(result);
      // await PublishOrderEvents(result);

      const response = {
        product: result.data.product,
        unit: result.data.quantity,
      };
      return successResponse(
        res,
        response,
        "Product added to cart successfully",
        200
      );
    } catch (error: any) {
      return errorResponse(
        res,
        `Error adding product to cart: ${error.message}`,
        400,
        true
      );
    }
  }

  static async GetProductPayload(userId: string, data: any, event: string) {
    const { productId, quantity, isRemove } = data;
    const product = await Product.findById(productId);
    if (product) {
      const payload = {
        event,
        data: { userId, quantity, product, isRemove },
      };

      return payload;
    }
  }
}




// rabbit(function(conn) {
//   conn.createChannel(function(err, ch) {
//       ch.assertQueue(communicationNotificationQueue, {durable: true});
//       ch.consume(communicationNotificationQueue, function(msg) {
//           const lang = msg.properties.headers.language || 'en';
//           setLang(lang);
//           const body = JSON.parse(msg.content.toString());
//           tripLogic.sendCommunicationNotification(body);
//           ch.ack(msg);
//           console.log("Communication queue connected");
//       }, {noAck: false});
//   });
// });