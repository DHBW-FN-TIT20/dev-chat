import type { NextApiRequest, NextApiResponse } from 'next'
import { IChatKey } from '../../../public/interfaces';
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  allChatKeys: IChatKey[],
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is a api route to get all chat keys.
 * @param req the request object (body: userToken)
 * @param res the response object (body: allChatKeys)
 */
export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken: string = req.body.userToken;

  let allChatKeys = await BACK_END_CONTROLLER.fetchAllChatKeys(userToken);

  res.status(200).json({ allChatKeys: allChatKeys });
}
