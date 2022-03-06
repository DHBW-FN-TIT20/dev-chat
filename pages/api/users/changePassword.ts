import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to changes the password from the current user in the database.
 * @param req the request object (body: userToken, newPassword, oldPassword)
 * @param res the response object (body: wasSuccessfull)
 * @category API
 * @subcategory User
 */
async function changePasswordHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const newPassword: string = req.body.newPassword;
  const oldPassword: string = req.body.oldPassword;

  const changedSuccesfully = await BACK_END_CONTROLLER.handleChangeUserPassword(userToken, oldPassword, newPassword);

  res.status(200).json({ wasSuccessfull: changedSuccesfully });
}
export default changePasswordHandler;