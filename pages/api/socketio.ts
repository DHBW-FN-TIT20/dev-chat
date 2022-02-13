/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../shared/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  console.log("handler socketio");
    if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;

    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_KEY || '';
    const supabse = createClient(supabaseUrl, supabaseKey);
    const ChatMessageSubscription = supabse
        .from('ChatMessage')
        .on('*', payload => {
            console.log('Change received!', payload)
            console.log(req.body.chatKey);
            io.emit("message", payload);
        })
        .subscribe()

  }
  res.end();
};
