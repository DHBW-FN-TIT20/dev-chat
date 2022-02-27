import { NextApiRequest, NextApiResponse } from "next";
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  isVerified: boolean;
}

const backEndController = new BackEndController();


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let token = req.body.token;

  let isValid = await backEndController.isUserTokenValid(token);

  res.status(200).json({ isVerified: isValid });
}