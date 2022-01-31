// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SupabaseConnenction } from '../supabaseAPI';

type Data = {
  wasSuccessfull: boolean
}

const supabaseConnenction = new SupabaseConnenction();

/**
 * This is a api route to create a user in the database.
 * @param req the request object (body: username, password)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let username = req.body.username;
  let password = req.body.password;

  console.log("Username in handler",  username);
  console.log("Password in handler", password);
  let registerUserWasSuccessfull = await supabaseConnenction.registerUser(username, password);

  res.status(200).json({ wasSuccessfull: registerUserWasSuccessfull });
}