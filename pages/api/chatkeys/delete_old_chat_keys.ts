// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { DatabaseModel } from '../databaseModel';

type Data = {
    wasSuccessfull: boolean
}

const supabaseConnection = new DatabaseModel();

/**
 * This is a api route to delete old chat keys
 * @param res the response object (body: wasSuccessfull)
 */
    export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {  
        console.log("TEST 2");
    let deleted = await supabaseConnection.deleteOldChatKeys();
    res.status(200).json({ wasSuccessfull: deleted });
}