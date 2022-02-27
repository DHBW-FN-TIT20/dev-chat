import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean
}

const backEndController = new BackEndController();

/**
 * This is a api route to invert the status of a ticket. (ToDo->Done | Done->ToDo)
 * @param req the request object (body: currentToken,ticketID,currentStatus)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let currentToken = req.body.currentToken;
  let ticketID = req.body.ticketID;
  let currentState = req.body.currentState;

  let wasSuccessfull = await backEndController.changeSolvedState(currentToken,ticketID,currentState)
  res.status(200).json({ wasSuccessfull: wasSuccessfull });
}