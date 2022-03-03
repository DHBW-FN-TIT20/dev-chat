import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to send the join room message to the database.
 * @param req the request object (body: userToken, chatKey, joinOrLeave)
 * @param res the response object (body: wasSuccessfull)
 * @category API
 * @subcategory Message
 */
async function joinLeaveRoomMessageHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const chatKey: string = req.body.chatKey;
  const joinOrLeave: string = req.body.joinOrLeave;

  const messageAddedSuccessfully = await BACK_END_CONTROLLER.handleJoinLeaveRoomMessage(userToken, chatKey, joinOrLeave);

  res.status(200).json({ wasSuccessfull: messageAddedSuccessfully });
}
export default joinLeaveRoomMessageHandler;