export interface SignupPayload {
    id: string;
    email: string;
    phone?: string;
}

export interface SigninPayload {
    id: string;
    email: string;
    password?: string;
}

export interface AddressPayload {
    street: string;
    postalCode: string;
    city: string;
    country: string;
}

export interface ProductPayload {
    name: string;
    desc: string;
    banner: string;
    type: string;
    unit: number;
    price: number;
    available: boolean;
    supplier: string;
}

export enum Type {
    VEGETABLES='vegetables',
    OILS='oils',
    FRUITS='fruits',
}