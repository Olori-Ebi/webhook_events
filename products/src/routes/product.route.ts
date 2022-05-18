import express from "express";
import { verifyUser } from '../middleware/authentication'
import ProductController from "../controllers/product.controller";
import { validateProductRequest } from "../middleware/request";

const productRouter = express.Router();

productRouter.post("/create", validateProductRequest, verifyUser, ProductController.createProduct);
productRouter.get("/category/:type", verifyUser, ProductController.getProductCategory);
productRouter.get("/", verifyUser, ProductController.getProducts);
productRouter.put("/cart", verifyUser, ProductController.addProductToCart);
productRouter.put("/wishlist", verifyUser, ProductController.addProductToWishlist);


export default productRouter;