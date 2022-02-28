import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to delete a chatKey
 * @param req the request object (body: userToken, chatKeyToDelete)
 * @param res the response object (body: wasSuccessfull)
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userToken: string = req.body.userToken;
  const chatKeyToDelete: number = req.body.chatKeyToDelete;

  const deletedSuccessfully = await BACK_END_CONTROLLER.deleteChatKey(userToken, chatKeyToDelete);

  res.status(200).json({ wasSuccessfull: deletedSuccessfully });
}
