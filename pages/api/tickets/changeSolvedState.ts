import type { NextApiRequest, NextApiResponse } from 'next'
import { SupabaseConnection } from '../supabaseAPI';

type Data = {
  wasSuccessfull: boolean
}

const supabaseConnection = new SupabaseConnection();

/**
 * This is a api route to invert the status of a ticket. (ToDo->Done | Done->ToDo)
 * @param req the request object (body: currentToken,ticketID,currentStatus)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let currentToken = req.body.currentToken;
  let ticketID = req.body.ticketID;
  let currentState = req.body.currentState;

  let wasSuccessfull = await supabaseConnection.changeSolvedState(currentToken,ticketID,currentState)
  res.status(200).json({ wasSuccessfull: wasSuccessfull });
}