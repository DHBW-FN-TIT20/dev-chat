import { NextApiRequest, NextApiResponse } from "next";
import { ISurvey } from "../../../public/interfaces";
import { DatabaseModel } from "../databaseModel";
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  allSurveys: ISurvey[],
}

const DATABASE_MODEL = new DatabaseModel();
const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to get all Surveys from the Database (admin only)
 * @param req the request object (body: userToken)
 * @param res the response object (body: allSurveys)
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken: string = req.body.userToken;

  let surveyData: ISurvey[] = [];

  if (await BACK_END_CONTROLLER.isUserTokenValid(userToken) && BACK_END_CONTROLLER.getIsAdminFromToken(userToken)) {
    surveyData = await DATABASE_MODEL.getAllSurveys();
  }

  res.status(200).json({ allSurveys: surveyData })
}