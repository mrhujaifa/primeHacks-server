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

export const AdminControllers = {
  getAllUsers,
};
