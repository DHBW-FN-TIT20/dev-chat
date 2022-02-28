import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';
import { DatabaseModel } from '../databaseModel';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();
const DATABASE_MODEL = new DatabaseModel();

/**
 * This is an api route to add a message to the database
 * @param req the request object (body: message, userToken, chatKey)
 * @param res the response object (body: wasSuccessfull)
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let message = req.body.message;
  let userToken = req.body.userToken;
  let chatKey = req.body.chatKey;

  let addedSucessfully = await BACK_END_CONTROLLER.handleChatMessage(message, await DATABASE_MODEL.getChatKeyID(chatKey), userToken = userToken);

  res.status(200).json({ wasSuccessfull: addedSucessfully });
}