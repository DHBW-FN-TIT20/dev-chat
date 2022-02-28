import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to remove a user from the database.
 * @param req the request object (body: userToken, usernameToDelete)
 * @param res the response object (body: wasSuccessfull)
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const usernameToDelete: string = req.body.usernameToDelete;

  const removedSuccessfully = await BACK_END_CONTROLLER.deleteUser(userToken, usernameToDelete);

  res.status(200).json({ wasSuccessfull: removedSuccessfully });
}