import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  returnString: string,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to register a new user
 * @param req the request object (body: username, password)
 * @param res the response object (body: returnString)
 * @category API
 * @subcategory User
 */
async function registerHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const username: string = req.body.username;
  const password: string = req.body.password;

  const userRegisterReturn: string = await BACK_END_CONTROLLER.handleRegisterUser(username, password);

  res.status(200).json({ returnString: userRegisterReturn })
}
export default registerHandler;