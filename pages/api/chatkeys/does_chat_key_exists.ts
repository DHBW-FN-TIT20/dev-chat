import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to check if ChatKey exists
 * @param req the request object (body: chatKey)
 * @param res the response object (body: wasSuccessfull)
 * @category API
 * @subcategory ChatKey
 */
async function doesChatKeyExistHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const chatKey: string = req.body.chatKey;

  const doesChatKeyExists = await BACK_END_CONTROLLER.handleDoesChatKeyExist(chatKey);

  res.status(200).json({ wasSuccessfull: doesChatKeyExists });
}
export default doesChatKeyExistHandler;