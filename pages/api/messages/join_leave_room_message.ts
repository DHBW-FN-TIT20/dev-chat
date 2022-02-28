import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is a api route to send the join room message to the database.
 * @param req the request object (body: userToken, chatKey, joinOrLeave)
 * @param res the response object (body: wasSuccessfull)
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken: string = req.body.userToken;
  let chatKey: string = req.body.chatKey;
  let joinOrLeave: string = req.body.joinOrLeave;

  let messageAddedSuccessfully = await BACK_END_CONTROLLER.joinLeaveRoomMessage(userToken, chatKey, joinOrLeave);

  res.status(200).json({ wasSuccessfull: messageAddedSuccessfully });
}