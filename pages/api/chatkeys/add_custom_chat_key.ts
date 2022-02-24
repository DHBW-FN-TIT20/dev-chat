import type { NextApiRequest, NextApiResponse } from 'next'
import { SupabaseConnection } from '../supabaseAPI';

type Data = {
  wasSuccessfull: boolean
}

const supabaseConnection = new SupabaseConnection();

/**
 * This is a api route to remove a survey from the database
 * @param req the request object (body: userToken, surveyIDToDelete)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let customChatKey = req.body.customChatKey
  let wasSuccessfull: boolean = false;
  
  if(supabaseConnection.getIsAdminFromToken(userToken)){
    wasSuccessfull = await supabaseConnection.addChatKey(customChatKey);
  }
  else{
      console.log("You are allowed to create a custom ChatKey");
  }
  res.status(200).json({ wasSuccessfull: wasSuccessfull });
}