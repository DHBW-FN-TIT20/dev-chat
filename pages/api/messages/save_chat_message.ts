// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SupabaseConnection } from '../supabaseAPI';

type Data = {
  wasSuccessfull: boolean
}

const supabaseConnection = new SupabaseConnection();

/**
 * This is a api route to add a message to the database
 * @param req the request object (body: message, userId, chatKeyId)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let message = req.body.message;
  let username: string = req.body.username;
  let chatKey:string = req.body.chatKey;

  let addedSucessfully = await supabaseConnection.addChatMessage(message, username, chatKey);
  res.status(200).json({ wasSuccessfull: addedSucessfully });
}