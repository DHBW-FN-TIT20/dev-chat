// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SupabaseConnection } from '../supabaseAPI';

type Data = {
  wasSuccessfull: boolean
}

const supabaseConnection = new SupabaseConnection();

/**
 * This is a api route to remove a user from the database.
 * @param req the request object (body: currentUserId, currentUserPassword, usernameToDelete)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let currentUserId = req.body.currentUserId;
  let currentUserPassword = req.body.currentUserPassword;
  let usernameToDelete = req.body.usernameToDelete;

  let removedSuccessfully = await supabaseConnection.removeUser(currentUserId, currentUserPassword, usernameToDelete);

  res.status(200).json({ wasSuccessfull: removedSuccessfully });
}