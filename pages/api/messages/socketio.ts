import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../../shared/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { createClient } from "@supabase/supabase-js";
import { SupabaseConnection } from "../supabaseAPI";


export const config = { api: { bodyParser: false, }, };

/**
 * This is a api route handler to subscribe to the chat messages table
 * @param req the request object
 * @param res the response object
 */
export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {

  // if there is no SocketIO server -> create one
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");

    // create SocketIO server (on top of the NextJs default server)
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, { path: "/api/messages/socketio" });
    res.socket.server.io = io;

    // create the supabase client
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    let supabaseConnection = new SupabaseConnection();

    // subscribe to the ChatMessages table 
    const ChatMessageSubscription = supabase
      .from('ChatMessage')
      .on('INSERT', async payload => {
        const chatKey = await supabaseConnection.getChatKey(payload.new.ChatKeyID);
        console.log(`Change received: Msg: ${payload.new.Message} | ChatKey: ${chatKey?.threeWord} | User: ${payload.new.UserID}`);
        io.emit("message", chatKey?.threeWord);
      })
      .subscribe()
  }
  res.end();
};
