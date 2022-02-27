// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { IChatKey } from '../../../public/interfaces';
import { BackEndController } from '../../../controller/backEndController';
import { DatabaseModel } from '../databaseModel';

type Data = {
  allChatKeys : IChatKey[];
}

const databaseModel = new DatabaseModel();
const backEndController = new BackEndController();

/**
 * This is a api route to get all chat keys.
 * @param req the request object 
 * @param res the response object 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  let userToken: string = req.body.userToken;
  databaseModel.deleteOldChatKeys();

  let allChatKeys = await backEndController.fetchAllChatKeys(userToken);

  res.status(200).json({ allChatKeys: allChatKeys});
}
