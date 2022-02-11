import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseConnection } from "../supabaseAPI"

type Data = {
  wasSuccessfull: boolean;
  usernameValid: boolean;
  passwordValid: boolean;
}

const supabaseConnection = new SupabaseConnection();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let username = req.body.username;
  let password = req.body.password;
  let userCreate: boolean = false
  let vUsernameValid: boolean = await supabaseConnection.isUsernameValid(username);
  let vPasswordValid: boolean = await supabaseConnection.isPasswordValid(password);
  console.log("vPasswordValid: "+vPasswordValid);
  console.log("vUsernameValid: "+vUsernameValid);
  if(vUsernameValid && vPasswordValid)
  {
    userCreate = await supabaseConnection.registerUser(username, password)
  }
  res.status(200).json({ wasSuccessfull: userCreate, usernameValid: vUsernameValid, passwordValid: vPasswordValid })
}