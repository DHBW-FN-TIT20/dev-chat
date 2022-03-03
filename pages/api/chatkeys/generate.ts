import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  newChatKey: string,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to create a new chatKey (threeword)
 * @param req the request object (body: empty)
 * @param res the response object (body: newChatKey)
 * @category API
 * @subcategory ChatKey
 */
async function generateChatKeyHandler(req: NextApiRequest, res: NextApiResponse<Data>) {

  const keyword = await BACK_END_CONTROLLER.handleGenerateChatKey();

  res.status(200).json({ newChatKey: keyword });
}
export default generateChatKeyHandler;