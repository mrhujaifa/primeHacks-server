import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { IRequestUser } from "../../types/user";

const getAllUsers = async () => {
  const alluser = await prisma.user.findMany();

  return alluser;
};

// const changeUserRole = async (user: IRequestUser) => {
//   const users = await prisma.user.findUnique({
//     where: { id: user.userId },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   const result = await prisma.user.update({
//     where: { id: user.userId },
//     data: { role: user.role },
//   });

//   return result;
// };

// const changeUserStatus = async (userId: string, status: UserStatus) => {
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   const result = await prisma.user.update({
//     where: { id: userId },
//     data: { status },
//   });

//   return result;
// };

// const approveSubmission = async (
//   submissionId: string,
//   reviewerId: string,
//   feedback?: string,
// ) => {
//   const submission = await prisma.submission.findUnique({
//     where: { id: submissionId },
//   });

//   if (!submission) {
//     throw new Error("Submission not found");
//   }

//   const result = await prisma.submission.update({
//     where: { id: submissionId },
//     data: {
//       status: SubmissionStatus.APPROVED,
//       feedback,
//       reviewedAt: new Date(),
//       reviewedById: reviewerId,
//     },
//   });

//   return result;
// };

// const rejectSubmission = async (
//   submissionId: string,
//   reviewerId: string,
//   feedback?: string,
// ) => {
//   const submission = await prisma.submission.findUnique({
//     where: { id: submissionId },
//   });

//   if (!submission) {
//     throw new Error("Submission not found");
//   }

//   const result = await prisma.submission.update({
//     where: { id: submissionId },
//     data: {
//       status: SubmissionStatus.REJECTED,
//       feedback,
//       reviewedAt: new Date(),
//       reviewedById: reviewerId,
//     },
//   });

//   return result;
// };

export const AdminServices = {
  getAllUsers,
  //   changeUserRole,
  //   changeUserStatus,
  //   approveSubmission,
  //   rejectSubmission,
};
