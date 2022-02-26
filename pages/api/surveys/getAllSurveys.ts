import { NextApiRequest, NextApiResponse } from "next";
import { ISurvey } from "../../../public/interfaces";
import { SupabaseConnection } from "../supabaseAPI";

type Data = {
    allSurveys : ISurvey[];
}

/**
 * This is a api route to get all Surveys from the Database
 * @param req the request object (body: userToken)
 * @param res the response object (body: allSurveys)
 */
const supabaseConnection = new SupabaseConnection();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  let userToken: string = req.body.userToken;
  let userIsValid: boolean = await supabaseConnection.isUserTokenValid(userToken);
  
    if (!userIsValid) {
      console.log("You are not an admin!");
    }
    
  let allSurveys = await supabaseConnection.getAllSurveys();

  res.status(200).json({ allSurveys : allSurveys })
}