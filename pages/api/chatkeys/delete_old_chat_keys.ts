import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean,
}

const BACK_END_CONTROLLER = new BackEndController();

/**
 * This is an api route to delete old/expired chat keys
 * @param req the request object (body: empty)
 * @param res the response object (body: wasSuccessfull)
 * @category API
 * @subcategory ChatKey
 */
async function deleteOldChatKeysHandler(req: NextApiRequest, res: NextApiResponse<Data>) {

  const deletedSuccessfully: boolean = await BACK_END_CONTROLLER.handleDeleteOldChatKeys();

  res.status(200).json({ wasSuccessfull: deletedSuccessfully });
}
export default deleteOldChatKeysHandler;