import type { NextApiRequest, NextApiResponse } from 'next'
import { IChatMessage } from '../../../public/interfaces';
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  chatMessages: IChatMessage[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route get all chat messages with a specific chatKey and a specific target user from the database.
 * @param req the request object (body: userToken, chatKey, lastMessageID)
 * @param res the response object (body: chatMessages: IChatMessage[])
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken: string = req.body.userToken;
  let chatKey: string = req.body.chatKey;
  let lastMessageID: number = req.body.lastMessageID;

  let chatMessages = await BACK_END_CONTROLLER.getChatMessages(userToken, chatKey, lastMessageID);

  res.status(200).json({ chatMessages: chatMessages });
}