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
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const surveyIDToDelete: number = req.body.surveyIDToDelete;

  const deletedSuccessfully = await BACK_END_CONTROLLER.deleteSurvey(userToken, surveyIDToDelete);

  res.status(200).json({ wasSuccessfull: deletedSuccessfully });
}