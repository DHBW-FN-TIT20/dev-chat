import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to add a message to the database
 * @param req the request object (body: message, userToken, chatKey)
 * @param res the response object (body: wasSuccessfull)
 * @category API
 * @subcategory Message
 */
export default async function saveChatMessageHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const message: string = req.body.message;
  const userToken: string = req.body.userToken;
  const chatKey: string = req.body.chatKey;

  const addedSucessfully = await BACK_END_CONTROLLER.handleSaveChatMessage(message, chatKey, userToken);

  res.status(200).json({ wasSuccessfull: addedSucessfully });
}