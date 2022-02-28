import type { NextApiResponse } from 'next'
import { getThreeWords } from '../../../shared/threeword_generator';
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
  newChatKey: string,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to create a new chatKey (threeword)
 * @param res the response object (body: wasSuccessfull, newChatKey)
 */
export async function handler(res: NextApiResponse<Data>) {

  let chatKey = getThreeWords();
  let addedSucessfully = await BACK_END_CONTROLLER.addChatKey(chatKey);

  res.status(200).json({ wasSuccessfull: addedSucessfully, newChatKey: chatKey });
}