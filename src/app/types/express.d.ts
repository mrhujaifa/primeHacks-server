import { auth } from "../../lib/auth.js";
import { IRequestUser } from "./user.js";

declare global {
  namespace Express {
    interface Request {
      user?: IRequestUser;
    }
  }
}
