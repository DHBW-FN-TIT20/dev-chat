import type { NextApiRequest, NextApiResponse } from 'next'
import { DatabaseModel } from '../databaseModel';
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean
}

const backEndController = new BackEndController();

/**
 * This is a api route to demote a user in the database.
 * @param req the request object (body: userToken, usernameToDemote)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let usernameToDemote = req.body.usernameToDemote;

  let demotedSuccessfully = await backEndController.updateUserAccessLevel(userToken, usernameToDemote, 0);
  res.status(200).json({ wasSuccessfull: demotedSuccessfully });
}