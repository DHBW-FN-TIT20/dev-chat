import { NextApiRequest, NextApiResponse } from "next";
import { ISurvey } from "../../../public/interfaces";
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  allSurveys: ISurvey[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to get all Surveys from the Database (admin only)
 * @param req the request object (body: userToken)
 * @param res the response object (body: allSurveys)
 * @category API
 * @subcategory Survey
 */
export default async function getAllSurveysHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;

  const surveyData = await BACK_END_CONTROLLER.handleGetAllSurveys(userToken);

  res.status(200).json({ allSurveys: surveyData })
}