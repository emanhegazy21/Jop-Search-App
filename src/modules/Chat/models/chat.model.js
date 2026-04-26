import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  editedAt: {
    type: Date,
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

const chatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

chatSchema.index({ senderId: 1 });
chatSchema.index({ receiverId: 1 });
chatSchema.index({ senderId: 1, receiverId: 1 });
chatSchema.index({ createdAt: -1 });
chatSchema.index({ "messages.timestamp": -1 });
chatSchema.index({ isActive: 1 });
chatSchema.index({ isBlocked: 1 });

// Virtual for unread message count
chatSchema.virtual("unreadCount").get(function () {
  return this.messages.filter(
    (msg) => !msg.isRead && !msg.isDeleted && msg.receiverId !== this.senderId
  ).length;
});

// Virtual for last message
chatSchema.virtual("lastMessage").get(function () {
  const activeMessages = this.messages.filter((msg) => !msg.isDeleted);
  return activeMessages.length > 0
    ? activeMessages[activeMessages.length - 1]
    : null;
});

// Virtual for message count
chatSchema.virtual("messageCount").get(function () {
  return this.messages.filter((msg) => !msg.isDeleted).length;
});

// to add a message
chatSchema.methods.addMessage = function (senderId, message) {
  this.messages.push({
    senderId,
    message,
    timestamp: new Date(),
  });
  return this.save();
};

//to mark message as read
chatSchema.methods.markMessageRead = function (messageId) {
  const message = this.messages.find(
    (msg) => msg._id.toString() === messageId.toString() && !msg.isDeleted
  );
  if (message) {
    message.isRead = true;
    message.readAt = new Date();
  }
  return this.save();
};

// to edit a message
chatSchema.methods.editMessage = function (messageId, newMessageContent) {
  const message = this.messages.find(
    (msg) => msg._id.toString() === messageId.toString() && !msg.isDeleted
  );
  if (message) {
    message.message = newMessageContent;
    message.editedAt = new Date();
  }
  return this.save();
};

// to soft delete a message
chatSchema.methods.deleteMessage = function (messageId) {
  const message = this.messages.find(
    (msg) => msg._id.toString() === messageId.toString()
  );
  if (message) {
    message.isDeleted = true;
    message.deletedAt = new Date();
  }
  return this.save();
};

//to get active messages only
chatSchema.methods.getActiveMessages = function () {
  return this.messages.filter((msg) => !msg.isDeleted);
};

export const Chat = mongoose.model("Chat", chatSchema);
