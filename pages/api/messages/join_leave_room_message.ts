// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
    messageAddedSuccessfully: boolean
}

const backEndController = new BackEndController();

/**
 * This is a api route to send the join room message to the database.
 * @param req the request object
 * @param res the response object
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken: string = req.body.userToken;
  let chatKey: string = req.body.chatKey;
  let joinOrLeave: string = req.body.joinOrLeave;

  let messageAddedSuccessfully = await backEndController.joinLeaveRoomMessage(userToken, chatKey, joinOrLeave);

  res.status(200).json({ messageAddedSuccessfully: messageAddedSuccessfully });
}