import Joi from "joi";

export const sendMessageSchema = Joi.object({
  receiverId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "Receiver ID is required",
      "string.pattern.base": "Invalid receiver ID format",
    }),
  message: Joi.string().trim().min(1).max(5000).required().messages({
    "string.empty": "Message cannot be empty",
    "string.min": "Message must be at least 1 character",
    "string.max": "Message cannot exceed 5000 characters",
  }),
}).unknown(false);

// for getting chat with user
export const getChatSchema = Joi.object({
  userId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "User ID is required",
      "string.pattern.base": "Invalid user ID format",
    }),
}).unknown(false);

//for marking message as read
export const markMessageReadSchema = Joi.object({
  chatId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "Chat ID is required",
      "string.pattern.base": "Invalid chat ID format",
    }),
  messageId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "Message ID is required",
      "string.pattern.base": "Invalid message ID format",
    }),
}).unknown(false);

//for updating chat status
export const updateChatStatusSchema = Joi.object({
  chatId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "Chat ID is required",
      "string.pattern.base": "Invalid chat ID format",
    }),
  isActive: Joi.boolean().required().messages({
    "boolean.base": "isActive must be a boolean value",
  }),
}).unknown(false);

//for deleting a chat message
export const deleteMessageSchema = Joi.object({
  chatId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "Chat ID is required",
      "string.pattern.base": "Invalid chat ID format",
    }),
  messageId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "Message ID is required",
      "string.pattern.base": "Invalid message ID format",
    }),
}).unknown(false);

//for editing a message
export const editMessageSchema = Joi.object({
  chatId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "Chat ID is required",
      "string.pattern.base": "Invalid chat ID format",
    }),
  messageId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "Message ID is required",
      "string.pattern.base": "Invalid message ID format",
    }),
  message: Joi.string().trim().min(1).max(5000).required().messages({
    "string.empty": "Message cannot be empty",
    "string.min": "Message must be at least 1 character",
    "string.max": "Message cannot exceed 5000 characters",
  }),
}).unknown(false);

//for searching chat history
export const searchChatSchema = Joi.object({
  query: Joi.string().trim().min(1).max(100).optional().messages({
    "string.min": "Search query must be at least 1 character",
    "string.max": "Search query cannot exceed 100 characters",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
  skip: Joi.number().integer().min(0).default(0).messages({
    "number.min": "Skip must be at least 0",
  }),
}).unknown(false);
