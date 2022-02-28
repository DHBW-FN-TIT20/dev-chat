import type { NextApiRequest, NextApiResponse } from 'next'
import { DatabaseModel } from '../databaseModel';

type Data = {
  userExists: boolean,
}

const DATABASE_MODEL = new DatabaseModel();

/**
 * This is an api route to check if a user already exists in the database.
 * @param req the request object (body: username)
 * @param res the response object (body: userExists)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const username: string = req.body.username;

  const userAlreadyExists: boolean = await DATABASE_MODEL.userAlreadyExists(username);

  res.status(200).json({ userExists: userAlreadyExists });
}