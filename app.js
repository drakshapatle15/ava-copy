var express = require("express");
var dotenv = require("dotenv");
dotenv.config();

var db = require("./database");
const bodyParser = require("body-parser");
const chatRouter = require("./chat/router");
const personaRouter = require("./persona/router");
const initializePersonas = require("./persona/migrate-v1");
const port = 5005;

var app = express();
app.use(bodyParser.json());
app.use("/chat", chatRouter);
app.use("/persona", personaRouter);

const { APIAuth, User } = require("./auth/models");
const { MessageList } = require("./chat/models");
const { Persona } = require("./persona/models");

app.post("/initdb", async (req, res) => {
  const adminUser = new User({ name: "admin" }, {}, { new: true });
  await adminUser.save();

  const adminKey = new APIAuth(
    { key: process.env.ADMIN_APIKEY, userID: adminUser._id, role: "admin" },
    {},
    { new: true }
  );
  await adminKey.save();

  await initializePersonas();

  const samplePersona = await Persona.findOne({});
  console.log(samplePersona);

  // const adminMessageList = new MessageList(
  //   { userID: adminKey.userID, personaID: samplePersona._id },
  //   {},
  //   { new: true }
  // );
  // await adminMessageList.save();
  // res.send({ message: "database initialised" });
});
async function initChat(userData) {
  try {
    // Check if chat with the given persona_id and user_chat_id already exists
    const existingChat = await MessageList.findOne({
      personaID: userData.personaID,
      userID: userData.userID,
    });

    if (existingChat) {
      // If chat exists, return the existing unique_id
      return { unique_id: existingChat._id, message: "Chat already exists" };
    } else {
      // If chat doesn't exist, create a new chat entry
      const newMessageList = new MessageList(userData);
      const result = await newMessageList.save();

      // Return the newly created unique_id
      return {
        unique_id: result._id,
        message: "Chat initialized successfully",
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Express route for initializing chat
app.post("/init-chat", async (req, res) => {
  const userData = req.body;

  try {
    const response = await initChat(userData);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port);
