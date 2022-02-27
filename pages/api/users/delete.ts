import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean
}

const backEndController = new BackEndController();

/**
 * This is a api route to remove a user from the database.
 * @param req the request object (body: userToken, usernameToDelete)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let usernameToDelete = req.body.usernameToDelete;

  let removedSuccessfully = await backEndController.deleteUser(userToken, usernameToDelete);

  res.status(200).json({ wasSuccessfull: removedSuccessfully });
}