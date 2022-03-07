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
 * @category API
 * @subcategory Survey
 */
async function changeExpirationDateHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const surveyIDToAlter: number = req.body.surveyIDToAlter;
  const expirationDate: Date = req.body.expirationDate;

  const changedSuccessfully = await BACK_END_CONTROLLER.handleChangeSurveyExpirationDate(userToken, surveyIDToAlter, expirationDate);

  res.status(200).json({ wasSuccessfull: changedSuccessfully });
}
export default changeExpirationDateHandler;