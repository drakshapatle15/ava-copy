const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageListSchema = Schema(
  {
    personaID: {
      type: Schema.ObjectId,
      required: true,
      ref: "Persona",
    },
    userID: {
      type: String,
      required: true,
    },

    name: { type: String, required: true },
    phoneNo: { type: String, required: true },
    countryCode: { type: String, required: true },
  },
  { timestamps: true }
);
MessageListSchema.index({ phoneNo: 1, personaID: 1 }, { unique: true });

const MessageList = mongoose.model("MessageList", MessageListSchema);

const MessageSchema = Schema(
  {
    role: {
      type: String,
      default: null,
      required: false,
    },
    content: {
      type: String,
      default: "",
      required: false,
    },
    isUser: {
      type: Boolean,
      default: null,
      required: false,
    },
    messageListID: {
      type: Schema.ObjectId,
      required: true,
      ref: "MessageList",
    },
  },
  { timestamps: true }
);

MessageSchema.pre("save", function (next) {
  if (this.isModified("role")) {
    this.isUser = this.role === "user";
  }
  next();
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = { MessageList, MessageListSchema, Message, MessageSchema };
