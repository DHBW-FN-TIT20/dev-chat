import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to invert the status of a ticket. (ToDo->Done | Done->ToDo)
 * @param req the request object (body: currentToken, ticketID, currentState)
 * @param res the response object (body: wasSuccessfull)
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const currentToken: string = req.body.currentToken;
  const ticketID: number = req.body.ticketID;
  const currentState: boolean = req.body.currentState;

  const changedSuccessfully = await BACK_END_CONTROLLER.changeSolvedState(currentToken, ticketID, currentState)

  res.status(200).json({ wasSuccessfull: changedSuccessfully });
}