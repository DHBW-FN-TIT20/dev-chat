import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to change the expirationdate of a chat
 * @param req the request object (body: userToken, chatKeyToAlter, expirationDate)
 * @param res the response object (body: wasSuccessfull)
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let chatKeyToAlter = req.body.chatKeyToAlter;
  let expirationDate = req.body.expirationDate;

  let addedSucessfully = await BACK_END_CONTROLLER.changeChatKeyExpirationDate(userToken, chatKeyToAlter, expirationDate);

  res.status(200).json({ wasSuccessfull: addedSucessfully });
}
