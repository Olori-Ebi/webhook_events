import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { SignupPayload } from "../payload";

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const generateToken = (payload: SignupPayload) => {
  const token = jwt.sign(payload, secretKey!);
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const payload = jwt.verify(token, secretKey!);
    return payload;
  } catch (error) {
    return false;
  }
};

export const hashedPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

export const comparePassword = (password: string, hashedPassword: string) => {
    return bcrypt.compareSync(password, hashedPassword)
}