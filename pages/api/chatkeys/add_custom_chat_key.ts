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
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let customChatKey = req.body.customChatKey;

  let addedSucessfully = false;

  if (await BACK_END_CONTROLLER.isUserTokenValid(userToken) && BACK_END_CONTROLLER.getIsAdminFromToken(userToken)) {
    addedSucessfully = await BACK_END_CONTROLLER.addChatKey(customChatKey);
  }

  res.status(200).json({ wasSuccessfull: addedSucessfully });
}
