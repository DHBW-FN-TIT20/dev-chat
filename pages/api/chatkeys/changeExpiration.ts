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
 * @category API
 * @subcategory ChatKey
*/
async function changeExpirationDateHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const chatKeyToAlter: number = req.body.chatKeyToAlter;
  const expirationDate: Date = req.body.expirationDate;
  console.log(expirationDate)
  const addedSuccessfully = await BACK_END_CONTROLLER.handleChangeChatKeyExpirationDate(userToken, chatKeyToAlter, expirationDate);

  res.status(200).json({ wasSuccessfull: addedSuccessfully });
}

export default changeExpirationDateHandler;
