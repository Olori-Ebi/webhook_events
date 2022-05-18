import mongoose, { Schema, Document } from 'mongoose';


export interface OrderDoc extends Document {
    orderId: string;
    customerId: string;
    items: any[];
    amount: number;
    status: string;
    txnId: string;
}


const OrderSchema = new Schema({
    orderId: String,
    customerId: String,
    amount: Number,
    status: String,
    txnId: String,
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


const Order = mongoose.model<OrderDoc>('order', OrderSchema);

export { Order }