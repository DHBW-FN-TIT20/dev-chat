import { NextApiRequest, NextApiResponse } from "next";
import { IBugTicket } from "../../../public/interfaces";
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  allTickets: IBugTicket[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to get all tickets from the database
 * @param req the request object (body: userToken)
 * @param res the response object (body: allTickets)
 * @category API
 * @subcategory Ticket
 */
export default async function getAllTicketsHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;

  const allTickets = await BACK_END_CONTROLLER.handleGetAllTickets(userToken);

  res.status(200).json({ allTickets: allTickets })
}