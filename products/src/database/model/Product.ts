import mongoose, { Schema, Document } from 'mongoose';

export interface ProductDoc extends Document {
    name: string;
    desc: string;
    banner: string;
    type: string;
    unit: number;
    price: number;
    available: boolean;
    supplier: string;
}

const ProductSchema = new Schema({
    name: String,
    desc: String,
    banner: String,
    type: String,
    unit: Number,
    price: Number,
    available: Boolean,
    supplier: String
});

const Product =  mongoose.model<ProductDoc>('product', ProductSchema);
export { Product }