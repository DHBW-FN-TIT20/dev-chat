import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean
}

const backEndController = new BackEndController();

/**
 * This is a api route to changes the password from the current user from the database.
 * @param req the request object (body: userToken, oldPassword, newPassword)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let newPassword = req.body.newPassword;
  let oldPassword = req.body.oldPassword;


  let changedSuccesfully = await backEndController.changeUserPassword(userToken, oldPassword, newPassword);

  console.log(String(changedSuccesfully))

  res.status(200).json({ wasSuccessfull: changedSuccesfully });
}