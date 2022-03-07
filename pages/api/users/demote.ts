import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';
import { ProDemote } from '../../../enums/accessLevel';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to demote a user in the database.
 * @param req the request object (body: userToken, usernameToDemote)
 * @param res the response object (body: wasSuccessfull)
 * @category API
 * @subcategory User
 */
async function demoteUserHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const usernameToDemote: string = req.body.usernameToDemote;

  const demotedSuccessfully = await BACK_END_CONTROLLER.handleUpdateUserAccessLevel(userToken, usernameToDemote, ProDemote.DEMOTE);

  res.status(200).json({ wasSuccessfull: demotedSuccessfully });
}
export default demoteUserHandler;