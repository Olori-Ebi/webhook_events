import mongoose, { Schema, Document } from "mongoose";
import { AddressDoc } from "./Address";

interface OrderDoc {

}

interface CustomerDoc extends Document {
  email: string;
  password: string;
  salt: string;
  address: [AddressDoc];
  cart: [any];
  orders: [any];
  wishlist: [any];
}

const CustomerSchema = new Schema(
  {
    email: String,
    password: String,
    salt: String,
    phone: String,
    address: [{ type: Schema.Types.ObjectId, ref: "address", required: true }],
    cart: [
      // {
      //   product: { type: Schema.Types.ObjectId, ref: 'product', required: true},
      //   unit: { type: Number, required: true}
      // }
      {
          product: {
            _id: { type: String, required: true },
            name: { type: String },
            banner: { type: String },
            price: { type: String }
        },
        unit: { type: Number, required: true },
      },
    ],
    wishlist: [
      {
            _id: { type: String, required: true },
            name: { type: String },
            description: { type: String },
            banner: { type: String },
            price: { type: Number },
            available: { type: Boolean },
      },
    ],
    orders: [{
            _id: { type: String, required: true },
            amount: { type: String },
            date: { type: Date, default: Date.now() },
      }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Customer = mongoose.model<CustomerDoc>("customer", CustomerSchema);

export default Customer;
