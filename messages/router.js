const express = require("express");
const router = express.Router();
const { Message, MessageList } = require("./models");
const { Persona } = require("../persona/models");

router.post("/create", async (req, res) => {
  const personaID = req.body.personaID;
  const userID = req.body.userID;

  try {
    // Check if a message list already exists with the same user ID and persona ID
    let existingMessageList = await MessageList.findOne({
      personaID: personaID,
      userID: userID,
    });

    if (existingMessageList) {
      // If it exists, return a message along with the existing message list ID
      return res.status(200).json({
        message: "Message list already exists",
        messageListID: existingMessageList._id,
      });
    }

    // If it doesn't exist, create a new message list
    const messageListAttributes = {
      personaID: personaID,
      userID: userID,
      name: req.body.name,
      phoneNo: req.body.phoneNo,
      countryCode: req.body.countryCode,
    };

    const messageList = new MessageList(messageListAttributes);
    await messageList.save();
    res.status(201).json(messageList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:messageListID", async (req, res) => {
  const messageListID = req.params.messageListID;
  console.log(messageListID);
  const textInput = req.body.textInput;

  if (!messageListID || !textInput) {
    res
      .status(422)
      .json({ message: "could not find messageListID and/or textInput" });
    return;
  }

  const messageList = await MessageList.findById(messageListID);
  console.log(messageList);

  if (!messageList) {
    res.status(404).json({ message: "could not find the MessageList" });
    return;
  }

  const persona = await Persona.findById(messageList.personaID);

  if (!persona) {
    res.status(404).json({ message: "could not find the given Persona" });
    return;
  }

  const userMessage = await Message.create({
    role: "user",
    content: textInput,
    isUser: true,
    messageListID: messageList._id,
  });

  return res.status(201).json(userMessage);
});

router.get("/:messageListID", async (req, res) => {
  const messageListID = req.params.messageListID;

  if (!messageListID) {
    res
      .status(422)
      .json({ message: "could not find the required messageListID" });
    return;
  }

  try {
    const chatHistory = await Message.find({ messageListID: messageListID })
      .lean()
      .exec();

    // console.log({ messageListID:  new ObjectId(messageListID)});
    console.log(chatHistory);
    return res.status(200).json(chatHistory);
  } catch (error) {
    console.log("errrorrr", error);
    return res.status(500).send(error);
  }
});

router.delete("/messageListID", async (req, res) => {
  const messageID = req.params.messageListID;

  if (!messageID) {
    return res
      .status(422)
      .json({ error: "could not find the required messageListID" });
  }

  try {
    const deletedMessage = await Message.deleteOne({ _id: messageID });

    if (deletedMessage.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "No message found for the provided messageID" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
