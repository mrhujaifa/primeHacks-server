import { auth } from "../../lib/auth";
import { IRequestUser } from "./user";

declare global {
  namespace Express {
    interface Request {
      user?: IRequestUser;
    }
  }
}
