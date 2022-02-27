import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean
}

const backEndController = new BackEndController();

/**
 * This is a api route to promote a user in the database.
 * @param req the request object (body: userToken, usernameToPromote)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let usernameToPromote = req.body.usernameToPromote;

  let promotedSuccessfully = await backEndController.updateUserAccessLevel(userToken, usernameToPromote, 1);
  res.status(200).json({ wasSuccessfull: promotedSuccessfully });
}