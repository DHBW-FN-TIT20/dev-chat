// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SupabaseConnenction } from '../supabaseAPI';

type Data = {
  wasSuccessfull: boolean
}

const supabaseConnenction = new SupabaseConnenction();

/**
 * This is a api route to remove a user from the database.
 * @param req the request object (body: currentUserId, currentUserPassword, usernameToDelete)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let currentUserId = req.body.currentUserId;
  let currentUserPassword = req.body.currentUserPassword;
  let usernameToDelete = req.body.usernameToDelete;

  let removedSuccessfully = await supabaseConnenction.removeUser(currentUserId, currentUserPassword, usernameToDelete);

  res.status(200).json({ wasSuccessfull: removedSuccessfully });
}