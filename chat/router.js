const express = require("express");
const router = express.Router();
const { model } = require("./llmchain");
const { Message, MessageList } = require("./models");
const { Persona } = require("../persona/models");
const authenticateUser = require("../auth/middlewares");
const { lastKChats } = require("./utils");
const { SystemMessage, HumanMessage, AIMessage } = require("langchain/schema");

router.post("/query", authenticateUser, async (req, res) => {
  const messageList = await MessageList.findOne({
    _id: req.body.messageListID,
  });
  const persona = await Persona.findById(messageList.personaID);
  const personaContent = persona.instruction;
  const history = await lastKChats(req.body.messageListID, 5);

  if (messageList.userID.equals(req.userID.toString())) {
    const aiMessage = await model.predictMessages([
      new SystemMessage((content = personaContent)),
      ...history,
      new HumanMessage((content = req.body.textInput)),
    ]);

    res.send({ message: aiMessage.content });
    const userMessage = await Message.create({
      role: "user",
      content: req.body.textInput,
      isUser: true,
      messageListID: messageList._id,
    });
    const assitantMessage = await Message.create({
      role: "assistant",
      content: aiMessage.content,
      isUser: false,
      messageListID: messageList._id,
    });
  } else {
    console.log("here");
    res.status(401).send();
  }
});

// router.get("/messages/:messageListID", authenticateUser, async (req, res) => {
//   const messageList = await Message.findOne({
//     _id: req.params.messageListID,
//   });
//   console.log(messageList.userID);
//   console.log(req.userID);

//   res.send({ Message });
// });

router.get("/messages", authenticateUser, async (req, res) => {
  try {
    const messageListID = req.query.messageListID;

    // Check if the messageListID is provided in the query parameters
    if (!messageListID) {
      return res
        .status(400)
        .json({ error: "messageListID is required in the query parameters" });
    }

    // Find all messages for the given messageListID
    const messages = await Message.find({ messageListID });
    console.log(messages);
    // Check if messages were found
    if (!messages || messages.length === 0) {
      return res
        .status(404)
        .json({ error: "No messages found for the provided messageListID" });
    }

    // Return the messages
    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/messages/:messageID", authenticateUser, async (req, res) => {
  try {
    const messageID = req.params.messageID;

    // Check if the messageID is provided in the URL parameters
    if (!messageID) {
      return res
        .status(400)
        .json({ error: "messageID is required in the URL parameters" });
    }

    // Find and delete the message by its ID
    const deletedMessage = await Message.deleteOne({ _id: messageID });

    // Check if a message was deleted
    if (deletedMessage.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "No message found for the provided messageID" });
    }

    // Return a success message
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/test", async (req, res) => {
  const { MessageList, Message } = require("./models");
  const lastKChats = async (messageListID, k) => {
    const recentChats = await Message.find({}).limit(k);
    const format = [];
    recentChats.map((chat) => {
      format.push([chat.isUser ? "user" : "ai", chat.content]);
    });
    return format;
  };
  await lastKChats("65512a2940e41ce1a71cb266", 4);
});

module.exports = router;
