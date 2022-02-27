import type { NextApiResponse } from 'next'
import { DatabaseModel } from '../databaseModel';

type Data = {
  wasSuccessfull: boolean,
}

const SUPABASE_CONNECTION = new DatabaseModel();

/**
 * This is a api route to delete old/expired chat keys
 * @param res the response object (body: wasSuccessfull)
 */
export async function handler(res: NextApiResponse<Data>) {

  let deletedSuccessfully = await SUPABASE_CONNECTION.deleteOldChatKeys();

  res.status(200).json({ wasSuccessfull: deletedSuccessfully });
}