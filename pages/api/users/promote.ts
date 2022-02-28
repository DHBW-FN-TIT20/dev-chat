import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';
import { AccessLevel } from '../../../enums/accessLevel';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is a api route to promote a user in the database.
 * @param req the request object (body: userToken, usernameToPromote)
 * @param res the response object (body: wasSuccessfull)
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const usernameToPromote: string = req.body.usernameToPromote;

  const promotedSuccessfully = await BACK_END_CONTROLLER.updateUserAccessLevel(userToken, usernameToPromote, AccessLevel.ADMIN);

  res.status(200).json({ wasSuccessfull: promotedSuccessfully });
}