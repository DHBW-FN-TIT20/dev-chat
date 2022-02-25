import type { NextApiRequest, NextApiResponse } from 'next'
import { SupabaseConnection } from '../supabaseAPI';

type Data = {
  wasSuccessfull: boolean
}

const supabaseConnection = new SupabaseConnection();

/**
 * This is a api route to demote a user in the database.
 * @param req the request object (body: userToken, usernameToDemote)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let usernameToDemote = req.body.usernameToDemote;

  let demotedSuccessfully = await supabaseConnection.demoteUser(userToken, usernameToDemote);
  res.status(200).json({ wasSuccessfull: demotedSuccessfully });
}