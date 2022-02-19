import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../../../public/interfaces";
import { SupabaseConnection } from "../supabaseAPI";

type Data = {
    allUsersCheck : IUser[];
}

const supabaseConnection = new SupabaseConnection();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let allUsers = await supabaseConnection.fetchAllUsers();

  res.status(200).json({ allUsersCheck : allUsers })
}