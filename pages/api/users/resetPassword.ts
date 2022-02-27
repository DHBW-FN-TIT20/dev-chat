import type { NextApiRequest, NextApiResponse } from 'next'
import { DatabaseModel } from '../databaseModel';

type Data = {
  wasSuccessfull: boolean
}

const databaseModel = new DatabaseModel();

/**
 * This is a api route to reset the password of a user in the database.
 * @param req the request object (body: userToken, usernameToReset)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let usernameToReset = req.body.usernameToReset;

  let resetSuccessfully = await databaseModel.resetPassword(userToken, usernameToReset);
  res.status(200).json({ wasSuccessfull: resetSuccessfully });
}