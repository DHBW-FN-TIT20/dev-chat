import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to create a new chatKey (custom)
 * @param req the request object (body: userToken, customChatKey)
 * @param res the response object (body: wasSuccessfull)
 * @category API
 * @subcategory ChatKey
 */
 async function addCustomChatKeyHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const customChatKey: string = req.body.customChatKey;

  const addedSucessfully: boolean = await BACK_END_CONTROLLER.handleAddCustomChatKey(userToken, customChatKey);

  res.status(200).json({ wasSuccessfull: addedSucessfully });
}
export default addCustomChatKeyHandler;
