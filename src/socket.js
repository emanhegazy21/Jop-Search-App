import { Chat } from "../src/modules/Chat/models/chat.model.js";
import User from "../src/modules/User/models/user.model.js";
import jwt from "jsonwebtoken";

export function initSocket(io) {
  //Authentication middleware - Verify JWT token on connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error("Authentication error - no token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error - invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`✅ Authenticated user connected: ${socket.userId}`);

    socket.on("sendMessage", async ({ receiverId, message }) => {
      try {
        const senderId = socket.userId; // Use authenticated userId
        
        //Validate receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
          socket.emit("error", { message: "Receiver not found" });
          return;
        }

        const sender = await User.findById(senderId);
        if (!sender) {
          socket.emit("error", { message: "Sender not found" });
          return;
        }

        const allowedRoles = ["HR", "owner"];
        const isStarter = allowedRoles.includes(sender.role);

        let chat = await Chat.findOne({
          $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        });

        if (!chat && isStarter) {
          chat = await Chat.create({ senderId, receiverId, messages: [] });
        }

        if (!chat) {
          socket.emit("error", { message: "You cannot start a chat with this user" });
          return;
        }

        chat.messages.push({ senderId, message, timestamp: new Date() });
        await chat.save();

        //Send message ONLY to the intended receiver, not to all users
        io.to(receiverId).emit("receiveMessage", { 
          senderId, 
          message,
          timestamp: new Date(),
          chatId: chat._id 
        });

        // Confirm to sender
        socket.emit("messageSent", { 
          receiverId, 
          message,
          timestamp: new Date(),
          chatId: chat._id 
        });
      } catch (err) {
        console.error("Error sending message:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  });
}
