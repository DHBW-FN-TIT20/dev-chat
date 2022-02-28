import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to change an expirationdate from a survey
 * @param req the request object (body: userToken, surveyIDToAlter, expirationDate)
 * @param res the response object (body: wasSuccessfull)
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let surveyIDToAlter = req.body.surveyIDToAlter;
  let expirationDate = req.body.expirationDate;

  let changedSuccessfully = await BACK_END_CONTROLLER.changeSurveyExpirationDate(userToken, surveyIDToAlter, expirationDate);

  res.status(200).json({ wasSuccessfull: changedSuccessfully });
}