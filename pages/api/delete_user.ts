// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { removeUser } from './supabaseAPI';

type Data = {
  wasSuccessfull: boolean
}

/**
 * This is a api route to remove a user from the database.
 * @param req the request object (body: username, password)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let username = req.body.username;
  let password = req.body.password;

  let removedSuccessfully = await removeUser(username, password);

  res.status(200).json({ wasSuccessfull: removedSuccessfully });
}