import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../../../public/interfaces";
import { BackEndController } from '../../../controller/backEndController';

type Data = {
    allUsers : IUser[];
}

const backEndController = new BackEndController();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  let userToken: string = req.body.userToken;
  let allUsers = await backEndController.fetchAllUsers(userToken);

  res.status(200).json({ allUsers : allUsers })
}