const mongoose = require("mongoose");
const { MessageListSchema } = require("../chat/models");
const Schema = mongoose.Schema;

var alnum = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
var APIKeyLength = 32;

var alnumOfLength = (len) => {
  let randString = "";
  for (let i = 0; i < len; i++) {
    randString += alnum.charAt(Math.floor(Math.random() * alnum.length));
  }
  return randString;
};

const UserSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      default: null,
      unique: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

const APIAuthSchema = Schema(
  {
    userID: {
      type: Schema.ObjectId,
      ref: "User",
    },
    key: {
      type: String,
      default: () => alnumOfLength(APIKeyLength),
      required: true,
      unique: true,
    },

    role: {
      type: String,
      default: "consumer",
      required: true,
    },
  },
  { timestamps: true }
);

const APIAuth = mongoose.model("APIAuth", APIAuthSchema);

module.exports = { APIAuth, APIAuthSchema, User, UserSchema };
