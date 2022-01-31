// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { IChatKey } from '../../../public/interfaces';
import { SupabaseConnection } from '../supabaseAPI';

type Data = {
  placeholder: any
}

const supabaseConnection = new SupabaseConnection();

/**
 * !!! not working yet !!!
 * This is a api route get chat keys.
 * @param req the request object 
 * @param res the response object 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ placeholder: "messages" });
}