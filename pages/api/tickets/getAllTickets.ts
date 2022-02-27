import { NextApiRequest, NextApiResponse } from "next";
import { IBugTicket } from "../../../public/interfaces";
import { BackEndController } from '../../../controller/backEndController';

type Data = {
    allTickets : IBugTicket[];
}

const backEndController = new BackEndController();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  let userToken: string = req.body.userToken;
  let allTickets = await backEndController.fetchAllTickets(userToken);

  res.status(200).json({ allTickets: allTickets })
}