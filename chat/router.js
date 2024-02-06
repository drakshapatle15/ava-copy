const express = require("express");
const { Message, MessageList } = require("../messages/models");
const { Persona } = require("../persona/models");
const { model } = require("./llmchain");
const { lastKChats } = require("./utils");
const { SystemMessage, HumanMessage, AIMessage } = require("langchain/schema");

const router = express.Router();

router.put("/:messageListID", async (req, res) => {
  try {
    const messageListID = req.params.messageListID;
    const textInput = req.body.textInput;

    console.log("Received text input:", textInput);

    if (!messageListID || !textInput) {
      return res
        .status(422)
        .json({ message: "Could not find messageListID and/or textInput" });
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

    let personaContent = persona.instruction;

    // Split personaContent into preamble and seedchat
    const [preamble, seedchat] = personaContent.split("###ENDPREAMBLE###");

    // Trim and preprocess preamble and seedchat separately
    const trimmedPreamble = preamble.trim().replace(/<[^>]*>/g, "");
    const trimmedSeedchat = seedchat
      ? seedchat.trim().replace(/<[^>]*>/g, "")
      : "";

    console.log("Trimmed Preamble:", trimmedPreamble);
    console.log("Trimmed Seedchat:", trimmedSeedchat);

    // Get conversation history from seedchat and previous user messages
    const historySize = persona.name === "Ava" ? 50 : 100;
    const seedchatHistory = await lastKChats(messageListID, historySize);

    // Concatenate preamble, seedchat, and user input to form the chain prompt
    const chainPrompt = [
      trimmedPreamble,
      trimmedSeedchat,
      ...seedchatHistory,
      textInput,
    ].join("\n");

    // Use chain prompt as input to predict the AI response
    const aiMessage = await model.predictMessages([
      new SystemMessage({ content: chainPrompt }),
    ]);

    // Replace placeholders in the AI-generated message with the user's name
    const personalizedResponse = aiMessage.content.replace(
      /\{name\}/g,
      messageList.name
    );
    console.log(messageList.name);
    console.log("Personalized Response:", personalizedResponse);

    // Save user and assistant messages to the database
    const userMessage = await Message.create({
      role: "user",
      content: textInput,
      isUser: true,
      messageListID: messageList._id,
    });

    const assistantMessage = await Message.create({
      role: "assistant",
      content: personalizedResponse,
      isUser: false,
      messageListID: messageList._id,
    });

    // Return the personalized AI-generated message
    res.status(201).json({ message: personalizedResponse });
  } catch (error) {
    console.error("Error in processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
