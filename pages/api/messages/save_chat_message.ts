// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SupabaseConnenction } from '../supabaseAPI';

type Data = {
  wasSuccessfull: boolean
}

const supabaseConnenction = new SupabaseConnenction();

/**
 * This is a api route to add a Message to the Message Database
 * @param req the request object (body: message, userId, chatKeyId)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let message = req.body.message;
  let userId = req.body.userId;
  let ChatKeyId = req.body.chatKeyId;

  //res.status(200).json({ wasSuccessfull: removedSuccessfully });
}