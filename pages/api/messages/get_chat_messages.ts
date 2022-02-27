// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { IChatMessage } from '../../../public/interfaces';
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  chatMessages: IChatMessage[]
}

const backEndController = new BackEndController();

/**
 * This is a api route get all chat messages with a specific three-word and a specific target user from the database.
 * @param req the request object (body: targetID: number, targetPassword: string, chatKey: string, lastMessageID: number)
 * @param res the response object (body: chatMessages: IChatMessage[])
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  let userToken: string = req.body.userToken;
  let chatKey: string = req.body.chatKey;
  let lastMessageID: number = req.body.lastMessageID;


  let chatMessages = await backEndController.getChatMessages(userToken, chatKey, lastMessageID);

  res.status(200).json({ chatMessages: chatMessages });
}