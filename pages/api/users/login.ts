import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  userToken: string,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to get a valid userToken
 * @param req the request object (body: username, password)
 * @param res the response object (body: userToken)
 * @category API
 * @subcategory User
 */
export default async function loginHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const username: string = req.body.username;
  const password: string = req.body.password;

  const token = await BACK_END_CONTROLLER.handleLoginUser(username, password);

  res.status(200).json({ userToken: token })
}