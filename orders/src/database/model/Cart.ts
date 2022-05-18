import mongoose, { Schema, Document } from 'mongoose';


export interface CartDoc extends Document {
    customerId: string;
    items: any[];
}


const CartSchema = new Schema({
    customerId: {type: String},
    items: [
        {
            product: {
                _id: { type: String, require: true},
                name: { type: String},
                desc: {type: String},
                banner: { type: String},
                type: {type: String},
                unit: { type: Number},
                price: { type: Number},
                suplier: { type: String}
            },
            unit: { type: Number, require: true}
        }
    ]
},{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;

        }
    },
    timestamps: true
});


const Cart = mongoose.model<CartDoc>('cart', CartSchema);

export { Cart }