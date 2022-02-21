import { NextApiRequest, NextApiResponse } from "next";
import { IBugTicket } from "../../../public/interfaces";
import { SupabaseConnection } from "../supabaseAPI";

type Data = {
    allTickets : IBugTicket[];
}

const supabaseConnection = new SupabaseConnection();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  let userToken: string = req.body.userToken;
  let allTickets = await supabaseConnection.fetchAllTickets(userToken);

  res.status(200).json({ allTickets: allTickets })
}