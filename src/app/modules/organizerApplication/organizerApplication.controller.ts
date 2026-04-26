import status from "http-status";
import { catchAsync } from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { OrganizerApplicationServices } from "./organizerApplication.service.js";

const createOrganizerApplication = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await OrganizerApplicationServices.createOrganizerApplication(
    user,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Organizer application submitted successfully",
    data: result,
  });
});

const getMyOrganizerApplication = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result =
    await OrganizerApplicationServices.getMyOrganizerApplication(user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Organizer application data retrieved successfully",
    data: result,
  });
});

export const OrganizerApplicationControllers = {
  createOrganizerApplication,
  getMyOrganizerApplication,
};
