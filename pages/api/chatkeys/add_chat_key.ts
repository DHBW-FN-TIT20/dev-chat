// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { IChatKey } from '../../../public/interfaces';
import { getThreeWords } from '../../../shared/threeword_generator';
import { BackEndController } from '../../../controller/backEndController';

type Data = {
    wasSuccessfull: boolean;
    newChatKey: string;
}

const backEndController = new BackEndController();

/**
 * This is a api route to add a message to the database
 * @param res the response object (body: wasSuccessfull)
 */
 export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {  
    
    let chatKey = getThreeWords();
    
    let addedSucessfully = await backEndController.addChatKey(chatKey);
    res.status(200).json({ wasSuccessfull: addedSucessfully, newChatKey: chatKey});
}