// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { IChatKey } from '../../../public/interfaces';
import { DatabaseModel } from '../databaseModel';

type Data = {
  placeholder: any
}

const supabaseConnection = new DatabaseModel();

/**
 * !!! not working yet !!!
 * This is a api route get surveys.
 * @param req the request object
 * @param res the response object
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ placeholder: "messages" });
}