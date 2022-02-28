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
export default async function handler(res: NextApiResponse<Data>) {

  const chatKey = getThreeWords();
  const addedSucessfully = await BACK_END_CONTROLLER.addChatKey(chatKey);

  res.status(200).json({ wasSuccessfull: addedSucessfully, newChatKey: chatKey });
}