// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Console } from 'console';
import type { NextApiRequest, NextApiResponse } from 'next'
import { SupabaseConnection } from '../supabaseAPI';

type Data = {
  wasSuccessfull: boolean
}

const supabaseConnection = new SupabaseConnection();

/**
 * This is a api route to check if a user already exists in the database.
 * @param req the request object (body: username, password)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let username = req.body.username;
  let userAlreadyExists = await supabaseConnection.userAlreadyExists(username);

  res.status(200).json({ wasSuccessfull: userAlreadyExists });
}