import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { OrganizerApplicationServices } from "./organizerApplication.service";

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
