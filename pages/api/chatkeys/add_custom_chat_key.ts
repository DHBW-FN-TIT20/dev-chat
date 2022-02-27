import type { NextApiRequest, NextApiResponse } from 'next'
import { BackEndController } from '../../../controller/backEndController';

type Data = {
  wasSuccessfull: boolean
}

const backEndController = new BackEndController();

/**
 * This is a api route to remove a survey from the database
 * @param req the request object (body: userToken, surveyIDToDelete)
 * @param res the response object (body: wasSuccessfull)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let userToken = req.body.userToken;
  let customChatKey = req.body.customChatKey
  let wasSuccessfull: boolean = false;
  
  if(backEndController.getIsAdminFromToken(userToken)){
    wasSuccessfull = await backEndController.addChatKey(customChatKey);
  }
  else{
      console.log("You are allowed to create a custom ChatKey");
  }
  res.status(200).json({ wasSuccessfull: wasSuccessfull });
}
