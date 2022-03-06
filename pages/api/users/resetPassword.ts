import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to reset the password of a user in the database.
 * @param req the request object (body: userToken, usernameToReset)
 * @param res the response object (body: wasSuccessfull)
 * @category API
 * @subcategory User
 */
async function resetPasswordHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const usernameToReset: string = req.body.usernameToReset;

  const resetSuccessfully = await BACK_END_CONTROLLER.handleResetUserPassword(userToken, usernameToReset);

  res.status(200).json({ wasSuccessfull: resetSuccessfully });
}
export default resetPasswordHandler;