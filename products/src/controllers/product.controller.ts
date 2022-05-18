import { Request, response, Response } from "express";
import { Product } from "../database/model/Product";
import errorResponse from "../utils/errorHandler";
import successResponse from "../utils/response";
import { PublishCustomerEvents, PublishOrderEvents } from '../utils/index'

export default class ProductController {
  static async createProduct(req: Request, res: Response) {
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

    console.log("===============  Customer Service Received Event ====== ");
    return res.status(200).json(payload);
  }

  static async SubscribeEvents(payload: any) {
    const { event, data } = payload;

    const { userId, product, order, qty } = data;

    switch (event) {
      // case "ADD_TO_WISHLIST":
      // case "REMOVE_FROM_WISHLIST":
      //   this.AddToWishlist(userId, product);
      //   break;
      // case "ADD_TO_CART":
      //   this.ManageCart(userId, product, qty, false);
      //   break;
      // case "REMOVE_FROM_CART":
      //   this.ManageCart(userId, product, qty, true);
      //   break;
      // case "CREATE_ORDER":
      //   this.ManageOrder(userId, order);
      //   break;
      case "TESTING":
        console.log("WOEKING")
        break;
      default:
        break;
    }
  }

  static async addProductToWishlist(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const { productId } = req.body;
      const result = await ProductController.GetProductPayload(id, {productId}, 'ADD_TO_WISHLIST') as any
      await PublishCustomerEvents(result)
      return successResponse(res, result.data.data, "Product added to wishlist successfully", 200);
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
        // console.log(quantity);
        
        const result = await ProductController.GetProductPayload(id, {productId, quantity, isRemove}, 'ADD_TO_CART') as any
        // console.log(result);
        
        await PublishCustomerEvents(result)
        // await PublishOrderEvents(result)
        
        const response = {
          product: result.data.product,
          unit: result.data.quantity
        }
        return successResponse(res, response, "Product added to cart successfully", 200);
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
    const { productId, quantity, isRemove } = data
    const product = await Product.findById(productId);
    if (product) {
      const payload = {
        event,
        data: { userId, quantity, product, isRemove },
      }

      return payload;
    } else {
      return errorResponse(response, "Sorry. Product not found", 404, true);
    }
  }
}
