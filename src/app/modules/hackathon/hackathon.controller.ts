import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { HackathonServices } from "./hackathon.service";

<<<<<<< HEAD
//* Create Hackathon
const createHackathon = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = (req as any).user;

  const result = await HackathonServices.createHackathon(user, payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Hackathon created successfull",
    data: result,
  });
});

//* Get All Hackathons
const getAllHackathons = catchAsync(async (req, res) => {
  const result = await HackathonServices.getAllHackathon();

  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Hackathon all data fetched successfully",
    success: true,
    data: result,
  });
});

export const HackathonControllers = {
  createHackathon,
  getAllHackathons,
=======
export const createHackathon = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const user = (req as any).user;

    const result = await HackathonServices.createHackathon(user, payload);

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Hackathon created successfull",
      data: result,
    });
  },
);

export const HackathonControllers = {
  createHackathon,
>>>>>>> eae79c10a2eee6011026327ba61f96ed3757200e
};
