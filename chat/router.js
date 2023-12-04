const express = require("express");
const {Message, MessageList} = require("../messages/models")
const {Persona} = require("../persona/models")
const { model } = require("./llmchain");
const { lastKChats } = require("./utils");
const { SystemMessage, HumanMessage, AIMessage } = require("langchain/schema");


const router = express.Router();

router.put("/:messageListID", async (req, res) => {

	const messageListID = req.params.messageListID;
	const textInput = req.body.textInput;

	if (!messageListID || !textInput) {
		res.status(422).json({ "message": "could not find messageListID and/or textInput" })
		return
	}

	const messageList = await MessageList.findById(messageListID);
	console.log(messageList)

	if (!messageList) {
		res.status(404).json({ "message": "could not find the MessageList" })
		return
	}

	const persona = await Persona.findById(messageList.personaID);

	if (!persona) {
		res.status(404).json({ "message": "could not find the given Persona" })
		return
	}

	const personaContent = persona.instruction;


	const history = await lastKChats(messageListID, 5);

	const aiMessage = await model.predictMessages([
		new SystemMessage((content = personaContent)),
		...history,
		new HumanMessage((content = textInput)),
	]);

	const userMessage = await Message.create({
		role: "user",
		content: textInput,
		isUser: true,
		messageListID: messageList._id,
	});
	const assitantMessage = await Message.create({
		role: "assistant",
		content: aiMessage.content,
		isUser: false,
		messageListID: messageList._id,
	});

	res.status(201).json({ message: aiMessage.content });

});

module.exports = router