import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { HackathonServices } from "./hackathon.service";

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

//* Get single Hackathon
// const getSingleHackathon = catchAsync(async (req, res) => {
//   const user = (req as any).user;
//   const result = await HackathonServices.getSingleHackathon(user);

//   sendResponse(res, {
//     httpStatusCode: status.OK,
//     success: true,
//     message: "Single hackathon retriened successfully",
//   });
// });

//* Get Own Hackathons
const getOwnHackathons = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await HackathonServices.getOwnHackathons(user);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Own hackathons retrieved successfully",
    data: result,
  });
});

//* Update Hackathon
const updateHackathon = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const { id } = req.params;
  const paylaod = req.body;
  const result = await HackathonServices.updateHackathon(
    user,
    id as string,
    paylaod,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Hackathon updated successfully",
    data: result,
  });
});

//* Delete hackathon
const deleteHackathon = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await HackathonServices.deleteHackathon(
    (req as any).user,
    id as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Hackathon deleted successfully",
    data: result,
  });
});

export const HackathonControllers = {
  createHackathon,
  getAllHackathons,
  getOwnHackathons,
  updateHackathon,
  deleteHackathon,
};
