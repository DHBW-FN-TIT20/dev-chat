import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean
}

const backEndController = new BackEndController();

/**
 * This is a api route to remove a survey from the database
 * @param req the request object (body: userToken, surveyIDToDelete)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let surveyIDToAlter = req.body.surveyIDToAlter;
  let expirationDate = req.body.expirationDate;

  let wasSuccessfull = await backEndController.changeSurveyExpirationDate(userToken, surveyIDToAlter, expirationDate);

  res.status(200).json({ wasSuccessfull: wasSuccessfull });
}