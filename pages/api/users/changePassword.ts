import type { NextApiRequest, NextApiResponse } from 'next'
import { SupabaseConnection } from '../supabaseAPI';

type Data = {
  wasSuccessfull: boolean
}

const supabaseConnection = new SupabaseConnection();

/**
 * This is a api route to changes the password from the current user from the database.
 * @param req the request object (body: userToken, oldPassword, newPassword)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let newPassword = req.body.newPassword;
  let oldPassword = req.body.oldPassword;


  let changedSuccesfully = await supabaseConnection.changeUserPassword(userToken, oldPassword, newPassword);

  console.log("Hallo")
  console.log(String(changedSuccesfully))

  res.status(200).json({ wasSuccessfull: changedSuccesfully });
}