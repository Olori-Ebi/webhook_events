import { Request, response, Response } from "express";
import { Address } from "../database/model/Address";
import Customer from "../database/model/Customer";
import { comparePassword, generateToken, hashedPassword } from "../utils/auth";
import errorResponse from "../utils/errorHandler";
import successResponse from "../utils/response";

export default class CustomerController {
  static async signup(req: Request, res: Response) {
    const { email, password, phone } = req.body;
    let userExist = await Customer.findOne({ email });
    if (userExist) return errorResponse(res, "Email is taken", 409, true);

    const hashed = hashedPassword(password);

    const customer = new Customer({
      phone,
      email,
      password: hashed,
    });

    const token = generateToken({ id: customer._id, email, phone });
    await customer.save();

    return successResponse(
      res,
      { customer, token },
      "customer created successfully",
      201
    );
  }

  static async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      let user = await Customer.findOne({ email });
      if (user && comparePassword(password, user.password)) {
        const token = generateToken({ id: user._id, email });
        return successResponse(
          res,
          { user, token },
          "customer logged in successfully",
          200
        );
      }
      return errorResponse(res, "Invalid credentials", 400, true);
    } catch (error:any) {
      return errorResponse(res, `Error logging in. ${error.message}`, 400, true);
    }
  }

  static async addAddress(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const { street, postalCode, city, country } = req.body;
  
      const customer = await Customer.findById(id);
  
      if (!customer) return errorResponse(res, "Customer not found", 404, true);
      const address = new Address({ street, postalCode, city, country });
      customer.address.push(address);
      await customer.save();
      await address.save();
      return successResponse(res, customer, "Address added successfully", 200);
    } catch (error:any) {
      return errorResponse(res, `Error adding address. ${error.message}`, 400, true);
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const customer = await Customer.findById(id)
      .populate("address")
      .populate("wishlist")
      // .populate("orders")
      // .populate("cart.product");

      return successResponse(res, customer, "Profile fetched successfully", 200);
    } catch (error: any) {
      return errorResponse(res, `Error fetching profile. ${error.message}`, 400, true);
    }
  }

  static async getWishlist(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const customer = await Customer.findById(id).populate('wishlist');
      return successResponse(res, customer && customer.wishlist, "Wishlist fetched successfully", 200);
    } catch (error: any) {
      return errorResponse(res, `Error fetching wishlist. ${error.message}`, 400, true);
    }
  }

  static async addProductToWishlist(userId: string, data: any) {
    try {
      const { _id, name, desc, price, available, banner } = data;
      const customer = await Customer.findById(userId);
      const product = { _id, name, description: desc, price, available, banner }
      
      if(customer && customer.wishlist.length > 0) {
          let isExist = false;
          const productIndex = customer.wishlist.findIndex(list => list._id == product._id);
          if(productIndex > -1) {
            customer.wishlist.splice(productIndex, 1);
            isExist = true;
          } else if(!isExist) {
            customer?.wishlist?.push(product);
          }
      } else {
        customer?.wishlist?.push(product);
      }
      
      await customer?.save();
      console.log(customer);
      
      // return successResponse(response, customer, "Product added to wishlist successfully", 200);
    } catch (error: any) {
      console.log(error);
      
      // return errorResponse(
      //   response,
      //   `Error adding product to wishlist: ${error.message}`,
      //   400,
      //   true
      // );
    }
  }

  static async addProductToCart(userId: string, data: any, quantity: number) {
    
    try {
        const { _id, name, price, banner, isRemove } = data;
        const customer = await Customer.findById(userId);
        console.log(customer);
        
        const product = { _id, name, price, banner }
        
          if(customer && customer.cart.length > 0){
            let isExist = false;
             customer.cart.map(item => {
                if(item.product._id.toString() === product._id.toString()){
                    if(isRemove){
                      customer && customer.cart.splice(customer.cart.indexOf(item), 1);
                    } else {
                        item.unit = quantity;
                    }
                    isExist = true;
                }
            });

            if(!isExist){
                customer?.cart?.push({product, unit: quantity});
            } 
        }else{
            customer?.cart?.push({product, unit: quantity});
        }
        console.log(customer);
        await customer?.save();
      } catch (error: any) {
        
      }
  }

  async ManageOrder(customerId: string, order: any) {
    // try {
    //   const orderResult = await this.repository.AddOrderToProfile(
    //     customerId,
    //     order
    //   );
    //   return FormateData(orderResult);
    // } catch (err) {
    //   throw new APIError("Data Not found", err);
    // }
  }

  static async AppEventTrigger(req: Request, res: Response) {
    const { payload } = req.body;

    CustomerController.SubscribeEvents(payload);

    console.log("===============  Customer Service Received Event ====== ");
    return res.status(200).json(payload);
  }

  static async SubscribeEvents(payload: any) {
    const { event, data } = payload;
    const { userId, product, order, quantity } = data;

    switch (event) {
      case "ADD_TO_WISHLIST":
      case "REMOVE_FROM_WISHLIST":
        
        CustomerController.addProductToWishlist(userId, product);
        break;
      case "ADD_TO_CART":
        console.log('herreeee');
        
        CustomerController.addProductToCart(userId, product, quantity);
        break;
      // case "REMOVE_FROM_CART":
      //   this.ManageCart(userId, product, qty, true);
      //   break;
      // case "CREATE_ORDER":
      //   CustomerController.ManageOrder(userId, order);
      //   break;
      case "TESTING":
        console.log("WOEKING")
        break;
      default:
        break;
    }
  }
}