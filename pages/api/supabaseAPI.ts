import { createClient } from '@supabase/supabase-js';

// create a supabase client
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

const supabaseUrl = "https://yffikhrkategkabkunhj.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDUzODUzMywiZXhwIjoxOTU2MTE0NTMzfQ.t0QAIVdegnHXUXQb9XGy2vMItq2KvgcTI6Lk1t-rV5Q"


console.log("supabase: ", supabaseUrl, supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

/** 
 * API function to check if the username and the password are correct 
 * @param {string} username the username to check
 * @param {string} password the password to check
 * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the username and password are correct
 */
export const isUserValid = async (username: string, hashedPassword: string): Promise<boolean> => {

  // fetch the data from the supabase database
  const { data, error } = await supabase
    .from('User')
    .select()
    .eq('Username', username)
    .eq('Password', hashedPassword);

  // check if data was received
  if (data === null || error !== null || data.length === 0) {

    // no users found -> user does not exist or password is wrong -> return false
    return false;
  } else {
    console.log("data", data);
    // user exists -> return true
    return true;
  }
};


/** 
 * API function to remove a user from the database 
 * @param {string} username the username of the user to remove
 * @param {string} hashedPassword the hashed password of the user to remove
 * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the user was removed
 */
export const removeUser = async (username: string, hashedPassword: string): Promise<boolean> => {

  // check if the user and the password are correct
  const isValid = await isUserValid(username, hashedPassword);

  if (!isValid) {
    // user and password are not correct -> return false
    return false;
  }

  // fetch the supabase database
  const { data, error } = await supabase
    .from('User')
    .delete()
    .match({ Username: username, Password: hashedPassword });

  // check if data was received
  if (data === null || error !== null || data.length === 0) {

    // user was not removed -> return false
    return false;
  } else {
    console.log("data", data);
    // user was removed -> return true
    return true;
  }
};