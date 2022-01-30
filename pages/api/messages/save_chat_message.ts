// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SupabaseConnenction } from '../supabaseAPI';

type Data = {
  wasSuccessfull: boolean
}

const supabaseConnenction = new SupabaseConnenction();

/**
 * This is a api route to add a message to the database
 * @param req the request object (body: message, userId, chatKeyId)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let message = req.body.message;
  let userId = req.body.userId;
  let chatKeyId = req.body.chatKeyId;

  let addedSucessfully = await supabaseConnenction.addChatMessage(message, userId, chatKeyId);
  res.status(200).json({ wasSuccessfull: addedSucessfully });
}