import { UserRole } from "../../../prisma/generated/prisma/enums";

export interface IRequestUser {
  userId: string;
  role: UserRole;
  email: string;
}
