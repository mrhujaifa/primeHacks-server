import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { HackathonServices } from "./hackathon.service";

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
};
