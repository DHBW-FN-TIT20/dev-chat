import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseConnection } from "../supabaseAPI"

type Data = {
  wasSuccessfull: boolean;
}

const supabaseConnection = new SupabaseConnection();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let username = req.body.username;
  let password = req.body.password;

  let userCreate = await supabaseConnection.registerUser(username, password)

  res.status(200).json({ wasSuccessfull: userCreate })
}