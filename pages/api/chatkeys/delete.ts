import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is a api route to delete a chatKey
 * @param req the request object (body: userToken, chatKeyToDelete)
 * @param res the response object (body: wasSuccessfull)
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let chatKeyToDelete = req.body.chatKeyToDelete;

  let deletedSuccessfully = await BACK_END_CONTROLLER.deleteChatKey(userToken, chatKeyToDelete);

  res.status(200).json({ wasSuccessfull: deletedSuccessfully });
}
