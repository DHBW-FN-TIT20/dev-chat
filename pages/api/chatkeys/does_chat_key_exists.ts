import type { NextApiRequest, NextApiResponse } from 'next'
import { DatabaseModel } from '../databaseModel';

type Data = {
  wasSuccessfull: boolean,
}

const DATABASE_MODEL = new DatabaseModel();

/**
 * This is an api route to check if ChatKey exists
 * @param req the request object (body: chatKey)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const chatKey: string = req.body.chatKey;

  const doesChatKeyExists = await DATABASE_MODEL.doesChatKeyExists(chatKey);

  res.status(200).json({ wasSuccessfull: doesChatKeyExists });
}