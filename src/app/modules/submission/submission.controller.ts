import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { SubmissionServices } from "./submission.service";

const createSubmission = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = (req as any).user;
  const { id } = req.params;

  const result = await SubmissionServices.createSubmission(
    user,
    id as string,
    payload,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "created project submission successfully",
    success: true,
    data: result,
  });
});
const getMySubmissions = catchAsync(async (req, res) => {
  const user = (req as any).user;

  const result = await SubmissionServices.getMySubmissions(user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "get my project submission successfully",
    success: true,
    data: result,
  });
});

export const SubmissionControllers = {
  createSubmission,
  getMySubmissions,
};
