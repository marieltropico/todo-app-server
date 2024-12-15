import { Request } from 'express';
import { Document } from 'mongoose';
import { Session } from 'express-session'; 

export interface UserDocument extends Document {
  _id: string;
  username: string;
  password: string;
}

export interface TodoDocument extends Document {
  _id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  session: Session & {
    userId?: string;
  }
}
