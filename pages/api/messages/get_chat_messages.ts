// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { IChatMessage } from '../../../public/interfaces';
import { SupabaseConnenction } from '../supabaseAPI';

type Data = {
  chatMessages: IChatMessage[]
}

const supabaseConnenction = new SupabaseConnenction();

/**
 * This is a api route get all chat messages with a specific three-word from the database.
 * @param req the request object (body: threeword)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let threeword = req.body.threeword;

  let messages = await supabaseConnenction.getChatMessages(threeword);

  res.status(200).json({ chatMessages: messages });
}