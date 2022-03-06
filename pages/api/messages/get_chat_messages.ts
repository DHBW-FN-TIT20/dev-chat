import type { NextApiRequest, NextApiResponse } from 'next'
import { IFChatMessage } from '../../../public/interfaces';
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  chatMessages: IFChatMessage[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route get all chat messages with a specific chatKey and a specific target user from the database.
 * @param req the request object (body: userToken, chatKey, lastMessageID)
 * @param res the response object (body: chatMessages: IChatMessage[])
 * @category API
 * @subcategory Message
 */
async function getChatMessagesHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const chatKey: string = req.body.chatKey;
  const lastMessageID: number = req.body.lastMessageID;
  // console.log("Get_CHAT_MESSAGE")
  const chatMessages: IFChatMessage[] = await BACK_END_CONTROLLER.handleGetChatMessages(userToken, chatKey, lastMessageID);
  // console.log(JSON.stringify(chatMessages))
  res.status(200).json({ chatMessages: chatMessages });
}
export default getChatMessagesHandler;