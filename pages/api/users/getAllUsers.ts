import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../../../public/interfaces";
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  allUsers: IUser[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to get all users from the database
 * @param req the request object (body: userToken)
 * @param res the response object (body: allUsers)
 * @category API
 * @subcategory User
 */
async function getAllUsersHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;

  const userData: IUser[] = await BACK_END_CONTROLLER.handleGetAllUsers(userToken);

  res.status(200).json({ allUsers: userData })
}
export default getAllUsersHandler;