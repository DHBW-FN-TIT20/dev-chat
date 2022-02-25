import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../../../public/interfaces";
import { SupabaseConnection } from "../supabaseAPI";

type Data = {
    wantedUser : string | undefined;
}

const supabaseConnection = new SupabaseConnection();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  let userID: number | undefined = req.body.userID;
  let wantedUser = await supabaseConnection.getUsernameByUserID(userID);
  res.status(200).json({ wantedUser : wantedUser})
}