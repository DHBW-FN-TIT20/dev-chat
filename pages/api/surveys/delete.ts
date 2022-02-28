import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to remove a survey from the database
 * @param req the request object (body: userToken, surveyIDToDelete)
 * @param res the response object (body: wasSuccessfull)
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let surveyIDToDelete = req.body.surveyIDToDelete;

  let deletedSuccessfully = await BACK_END_CONTROLLER.deleteSurvey(userToken, surveyIDToDelete);

  res.status(200).json({ wasSuccessfull: deletedSuccessfully });
}