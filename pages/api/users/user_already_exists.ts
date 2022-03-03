import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  userExists: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to check if a user already exists in the database.
 * @param req the request object (body: username)
 * @param res the response object (body: userExists)
 * @category API
 * @subcategory User
 */
async function userAlreadyExistsHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const username: string = req.body.username;

  const userAlreadyExists: boolean = await BACK_END_CONTROLLER.handleUserAlreadyExists(username);

  res.status(200).json({ userExists: userAlreadyExists });
}
export default userAlreadyExistsHandler;