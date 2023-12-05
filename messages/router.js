const express = require("express");
const router = express.Router();
const { Message, MessageList } = require("./models");
const { Persona } = require("../persona/models");




router.post("/create", async (req, res) => {

	const persona = Persona.findById(req.body.personaID);

	if (!persona || persona.size() == 0) {
		res.status(404).json({ "message": "no Persona found with the given personaID" })
		return;
	}
	try {
		const messageListAttributes = {
			personaID: req.body.personaID,
			userID: req.body.userID,
			name: req.body.name,
			phoneNo: req.body.phoneNo,
			countryCode: req.body.countryCode,
		}
		const messageList = new MessageList(messageListAttributes)
		await messageList.save()
		res.status(201).json(messageList)
	}
	catch {
		res.status(500);
	}
});

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

	const userMessage = await Message.create({
		role: "user",
		content: textInput,
		isUser: true,
		messageListID: messageList._id,
	});

	res.status(201).json(userMessage);

});


router.get("/:messageListID", async (req, res) => {

	const messageListID = req.params.messageListID;

	if (!messageListID) {
		res.status(422).json({ "message": "could not find the required messageListID" })
		return;
	}

	try {
		const chatHistory = await Message.find({ messageListID:  messageListID});
		console.log({ messageListID:  new ObjectId(messageListID)});
		console.log(chatHistory);
		res.status(200).json(chatHistory);
	}
	catch {
		res.status(500);
	}
});


router.delete("/messageListID", async (req, res) => {

	const messageID = req.params.messageListID;

	if (!messageID) {
		return res.status(422).json({ error: "could not find the required messageListID" });
	}

	try {
		const deletedMessage = await Message.deleteOne({ _id: messageID });

		if (deletedMessage.deletedCount === 0) {
			return res.status(404).json({ error: "No message found for the provided messageID" });
		}

		res.json({ message: "Message deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
