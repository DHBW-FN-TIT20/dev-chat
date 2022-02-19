import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../../../public/interfaces";
import { SupabaseConnection } from "../supabaseAPI";

type Data = {
    allUsers : IUser[];
}

const supabaseConnection = new SupabaseConnection();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  let userToken: string = req.body.userToken;
  let allUsers = await supabaseConnection.fetchAllUsers(userToken);

  res.status(200).json({ allUsers : allUsers })
}