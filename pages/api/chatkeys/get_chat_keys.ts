// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { IChatKey } from '../../../public/interfaces';
import { SupabaseConnection } from '../supabaseAPI';

type Data = {
  allChatKeys : IChatKey[];
}

const supabaseConnection = new SupabaseConnection();

/**
 * This is a api route to get all chat keys.
 * @param req the request object 
 * @param res the response object 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  let userToken: string = req.body.userToken;
  supabaseConnection.deleteOldChatKeys();

  let allChatKeys = await supabaseConnection.fetchAllChatKeys(userToken);

  res.status(200).json({ allChatKeys: allChatKeys});
}
