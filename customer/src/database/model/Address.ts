import mongoose, { Schema, Document } from 'mongoose';

export interface AddressDoc extends Document {
    street: string;
    postalCode: string;
    city: string;
    country: string;
}

const AddressSchema = new Schema({
    street: String,
    postalCode: String,
    city: String,
    country: String
});

const Address = mongoose.model<AddressDoc>('address', AddressSchema);
export { Address }