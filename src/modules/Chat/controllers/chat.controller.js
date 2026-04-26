import { Chat } from "../models/chat.model.js";
import { catchAsync } from "../../../utils/errorHandling.js";
import User from "../../User/models/user.model.js";
import { getIO } from "../../../app.js";

//Get chat history 
export const getChatWithUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  const chat = await Chat.findOne({
    $or: [
      { senderId: currentUserId, receiverId: userId },
      { senderId: userId, receiverId: currentUserId },
    ],
  }).populate("messages.senderId", "userName role");

  if (!chat) return res.status(404).json({ message: "No chat found" });

  res.json({ message: "Chat found", chat });
});

//Send message to user via HTTP and Socket.IO
export const sendMessage = catchAsync(async (req, res, next) => {
  const { receiverId, message } = req.body;
  const senderId = req.user._id;

  if (!receiverId || !message) {
    return res.status(400).json({ message: "receiverId and message are required" });
  }


  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({ message: "Receiver not found" });
  }


  let chat = await Chat.findOne({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  });


  if (!chat) {
    chat = await Chat.create({ senderId, receiverId, messages: [] });
  }

  const newMessage = {
    senderId,
    message,
    timestamp: new Date(),
  };

  chat.messages.push(newMessage);
  await chat.save();

 
  const io = getIO();
  if (io) {
    io.to(receiverId.toString()).emit("receiveMessage", {
      senderId,
      message,
      chatId: chat._id,
    });
  }

  res.status(201).json({
    message: "Message sent successfully",
    chat,
  });
});
//Get all chats for the current user
export const getAllChats = catchAsync(async (req, res, next) => {
  const currentUserId = req.user._id;

  // Find all chats where user is either sender or receiver
  const chats = await Chat.find({
    $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
  })
    .populate("senderId", "userName email role")
    .populate("receiverId", "userName email role")
    .populate("messages.senderId", "userName role")
    .sort({ updatedAt: -1 }) // Most recent first
    .lean();

  if (!chats || chats.length === 0) {
    return res.status(200).json({ message: "No chats found", chats: [] });
  }

  res.json({
    message: "Chats retrieved successfully",
    count: chats.length,
    chats,
  });
});
