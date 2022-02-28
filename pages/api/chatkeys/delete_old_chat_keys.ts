import type { NextApiResponse } from 'next'
import { DatabaseModel } from '../databaseModel';

type Data = {
  wasSuccessfull: boolean,
}

const DATABASE_MODEL = new DatabaseModel();

/**
 * This is a api route to delete old/expired chat keys
 * @param res the response object (body: wasSuccessfull)
 */
export async function handler(res: NextApiResponse<Data>) {

  let deletedSuccessfully = await DATABASE_MODEL.deleteOldChatKeys();

  res.status(200).json({ wasSuccessfull: deletedSuccessfully });
}