import express, { Request, Response } from "express";
import Customer from "../controllers/customer.controller";
import { validateAddressRequest, validateSigninRequest, validateSignupRequest } from "../middleware/request";
import { verifyUser } from '../middleware/authentication'

const customerRouter = express.Router();

customerRouter.get("/", (_req: Request, res: Response) => {
  res.send('Welcome')
});

customerRouter.post("/signup", validateSignupRequest, Customer.signup);
customerRouter.post("/signin", validateSigninRequest, Customer.signin);
customerRouter.post("/address", validateAddressRequest, verifyUser, Customer.addAddress);
customerRouter.get("/profile", verifyUser, Customer.getProfile);
customerRouter.get("/wishlist", verifyUser, Customer.getWishlist);
// customerRouter.put("/wishlist", verifyUser, Customer.addProductToWishlist);


export default customerRouter;