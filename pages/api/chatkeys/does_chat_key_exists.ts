// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { IChatKey } from '../../../public/interfaces';
import { DatabaseModel } from '../databaseModel';

type Data = {
    wasSuccessfull: boolean
}

const supabaseConnection = new DatabaseModel();

/**
 * This is a api route to check if ChatKey Exists
 * @param res the response object (body: wasSuccessfull)
 */
 export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {  
    let chatKey = req.body.chatKey;
    let doesChatKeyExists = await supabaseConnection.doesChatKeyExists(chatKey);
  
    res.status(200).json({ wasSuccessfull: doesChatKeyExists });
}