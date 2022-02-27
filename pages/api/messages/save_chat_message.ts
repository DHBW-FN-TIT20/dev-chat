// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';
import { DatabaseModel } from '../databaseModel';

type Data = {
  wasSuccessfull: boolean
}

const backEndController = new BackEndController();
const databaseModel = new DatabaseModel();

/**
 * This is a api route to add a message to the database
 * @param req the request object (body: message, userId, chatKeyId)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let message = req.body.message;
  let userToken = req.body.userToken;
  let chatKey = req.body.chatKey;

  let addedSucessfully = await backEndController.handleChatMessage(message, await databaseModel.getChatKeyID(chatKey), userToken = userToken);
  res.status(200).json({ wasSuccessfull: addedSucessfully });
}