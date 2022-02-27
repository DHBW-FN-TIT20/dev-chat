import type { NextApiRequest, NextApiResponse } from 'next'
import { DatabaseModel } from '../databaseModel';

type Data = {
  wasSuccessfull: boolean,
}

const SUPABASE_CONNECTION = new DatabaseModel();

/**
 * This is a api route to check if ChatKey exists
 * @param req the request object (body: chatKey)
 * @param res the response object (body: wasSuccessfull)
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let chatKey = req.body.chatKey;

  let doesChatKeyExists = await SUPABASE_CONNECTION.doesChatKeyExists(chatKey);

  res.status(200).json({ wasSuccessfull: doesChatKeyExists });
}