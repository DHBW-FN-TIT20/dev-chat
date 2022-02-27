import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../../../public/interfaces";
import { DatabaseModel } from "../databaseModel";

type Data = {
    wantedUser : string | undefined;
}

const supabaseConnection = new DatabaseModel();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  let userID: number | undefined = req.body.userID;
  let wantedUser = await supabaseConnection.getUsernameByUserID(userID);
  res.status(200).json({ wantedUser : wantedUser})
}