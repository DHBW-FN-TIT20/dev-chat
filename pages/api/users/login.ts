import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseConnection } from "../supabaseAPI";

type Data = {
  userToken: string;
}

const supabaseConnection = new SupabaseConnection();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let username = req.body.username;
  let password = req.body.password;

  let token = await supabaseConnection.loginUser(username,password);

  res.status(200).json({ userToken: token })
}