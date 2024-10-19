// src/types/express.d.ts
import { UserDocument } from '../models/user.model'; // Assuming you have a User model

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;  // Replace with the actual type for `user`
    }
  }
}
