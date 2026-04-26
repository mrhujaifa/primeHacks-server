import { UserRole } from "../../../prisma/generated/prisma/enums.js";

export interface IRequestUser {
  userId: string;
  role: UserRole;
  email: string;
}
