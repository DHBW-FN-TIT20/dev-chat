import type { NextApiRequest, NextApiResponse } from 'next'
import { SupabaseConnection } from '../supabaseAPI';

type Data = {
  wasSuccessfull: boolean
}

const supabaseConnection = new SupabaseConnection();

/**
 * This is a api route to remove a user from the database.
 * @param req the request object (body: userToken, usernameToDelete)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let usernameToDelete = req.body.usernameToDelete;

  let removedSuccessfully = await supabaseConnection.deleteUser(userToken, usernameToDelete);

  console.log("Hallo")
  console.log(String(removedSuccessfully))

  res.status(200).json({ wasSuccessfull: removedSuccessfully });
}