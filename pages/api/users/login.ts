import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  userToken: string;
}

const backEndController = new BackEndController();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let username = req.body.username;
  let password = req.body.password;

  let token = await backEndController.loginUser(username,password);

  res.status(200).json({ userToken: token })
}