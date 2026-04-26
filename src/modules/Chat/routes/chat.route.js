import { Router } from "express";
import * as chatController from "../controllers/chat.controller.js";
import { isAuthenticated, restrictTo } from "../../../middlewares/auth.middleware.js";
import { validate } from "../../../middlewares/validationMiddleware.js";
import {
  sendMessageSchema,
  getChatSchema,
} from "../validation/chat.validation.js";

const router = Router();


const endPoint = {
  sendMessage: ["user", "hr", "owner", "admin"],
  getChat: ["user", "hr", "owner", "admin"],
  getAllChats: ["user", "hr", "owner", "admin"],
};

// Send a message to another user
router.post(
  "/send",
  isAuthenticated,
  restrictTo(...endPoint.sendMessage),
  validate({ body: sendMessageSchema }), 
  chatController.sendMessage
);
// Get chat history with a specific user
router.get(
  "/:userId",
  isAuthenticated,
  restrictTo(...endPoint.getChat),
  validate({ params: getChatSchema }),
  chatController.getChatWithUser
);

// Get all chats for the current user
router.get(
  "/",
  isAuthenticated,
  restrictTo(...endPoint.getAllChats),
  chatController.getAllChats
);

export default router;
