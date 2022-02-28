import { NextApiResponseServerIO } from "../../../shared/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { createClient } from "@supabase/supabase-js";
import { DatabaseModel } from "../databaseModel";
import { BackEndController } from '../../../controller/backEndController';


export const CONFIG = { api: { bodyParser: false, }, };

/**
 * This is an api route handler to subscribe to the chat messages table
 */
export default async function handler(res: NextApiResponseServerIO) {

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
    const databaseModel = new DatabaseModel();
    const backEndController = new BackEndController();

    // print every minute a list of clients connected to the server
    const logAllClients = async () => {
      let clients = await io.sockets.fetchSockets();
      console.log(`${new Date().toLocaleString("de-DE")}: ${clients.length} clients connected`);
      clients.forEach(async socket => {
        const ip = socket.handshake.headers["x-real-ip"] || socket.handshake.headers["x-forwarded-for"] || socket.handshake.address || "";
        const chatKey = socket.handshake.auth.headers["chatKey"] || "";
        const user = await databaseModel.getIUserByUsername(backEndController.getUsernameFromToken(socket.handshake.auth.headers["userToken"] || "")) || "";
        console.log(`↳ ID: ${socket.id}, IP: ${ip}, user: ${user.name} chatKey: ${chatKey}`);
      });
    }
    logAllClients();

    setInterval(logAllClients, 60000);

    // subscribe to the ChatMessages table 
    const ChatMessageSubscription = supabase
      .from('ChatMessage')
      .on('INSERT', async payload => {
        const chatKey = await databaseModel.getChatKey(payload.new.ChatKeyID);
        console.log(`Change received: Msg: ${payload.new.Message} | ChatKey: ${chatKey?.threeWord} | User: ${payload.new.UserID}`);
        io.emit("message", chatKey?.threeWord);
      })
      .subscribe()
  }

  res.end();
};
