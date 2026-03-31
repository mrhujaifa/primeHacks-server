import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AdminServices } from "./admin.service";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllUsers();
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "all user fetched successfully",
    success: true,
    data: result,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;

  const result = await AdminServices.updateUserRole(
    id as string,
    req.body,
    user,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;

  const result = await AdminServices.updateUserStatus(
    id as string,
    req.body,
    user,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

export const AdminControllers = {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
};
