import type { NextApiRequest, NextApiResponse } from 'next'
import { SupabaseConnection } from '../supabaseAPI';

type Data = {
  wasSuccessfull: boolean
}

const supabaseConnection = new SupabaseConnection();

/**
 * This is a api route to remove a survey from the database
 * @param req the request object (body: userToken, surveyIDToDelete)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let chatKeyToDelete = req.body.chatKeyToDelete;

  let wasSuccessfull = await supabaseConnection.deleteChatKey(userToken, chatKeyToDelete);

  res.status(200).json({ wasSuccessfull: wasSuccessfull });
}