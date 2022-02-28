import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  isVerified: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to check if a user token is valid
 * @param req the request object (body: token)
 * @param res the response object (body: isVerified)
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token: string = req.body.token;

  const isValid = await BACK_END_CONTROLLER.isUserTokenValid(token);

  res.status(200).json({ isVerified: isValid });
}