import { NextApiRequest, NextApiResponse } from "next";
import { ISurvey } from "../../../public/interfaces";
import { DatabaseModel } from "../databaseModel";
import { BackEndController } from '../../../controller/backEndController';

type Data = {
    allSurveys : ISurvey[];
}

/**
 * This is a api route to get all Surveys from the Database
 * @param req the request object (body: userToken)
 * @param res the response object (body: allSurveys)
 */
const supabaseConnection = new DatabaseModel();
const backEndController = new BackEndController();


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  let userToken: string = req.body.userToken;
  let userIsValid: boolean = await backEndController.isUserTokenValid(userToken);
  
    if (!userIsValid) {
      console.log("You are not an admin!");
    }
    
  let allSurveys = await supabaseConnection.getAllSurveys();

  res.status(200).json({ allSurveys : allSurveys })
}