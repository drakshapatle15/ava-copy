// const express = require("express");
// const router = express.Router();
// const { Message, MessageList } = require("./models");
// const { Persona } = require("../persona/models");

// router.post("/create", async (req, res) => {

// 	const persona = Persona.findById(req.body.personaID);

// 	if (!persona || persona.size() == 0) {
// 		res.status(404).json({ "message": "no Persona found with the given personaID" })
// 		return;
// 	}
// 	try {
// 		const messageListAttributes = {
// 			personaID: req.body.personaID,
// 			userID: req.body.userID,
// 			name: req.body.name,
// 			phoneNo: req.body.phoneNo,
// 			countryCode: req.body.countryCode,
// 		}
// 		const messageList = new MessageList(messageListAttributes)
// 		await messageList.save()
// 		res.status(201).json(messageList)
// 	}
// 	catch {
// 		res.status(500);
// 	}
// });

// router.put("/:messageListID", async (req, res) => {

// 	const messageListID = req.params.messageListID;
// 	console.log(messageListID)
// 	const textInput = req.body.textInput;

// 	if (!messageListID || !textInput) {
// 		res.status(422).json({ "message": "could not find messageListID and/or textInput" })
// 		return
// 	}

// 	const messageList = await MessageList.findById(messageListID);
// 	console.log(messageList)

// 	if (!messageList) {
// 		res.status(404).json({ "message": "could not find the MessageList" })
// 		return
// 	}

// 	const persona = await Persona.findById(messageList.personaID);

// 	if (!persona) {
// 		res.status(404).json({ "message": "could not find the given Persona" })
// 		return
// 	}

// 	const userMessage = await Message.create({
// 		role: "user",
// 		content: textInput,
// 		isUser: true,
// 		messageListID: messageList._id,
// 	});

// 	return res.status(201).json(userMessage);

// });

// router.get("/:messageListID", async (req, res) => {

// 	const messageListID = req.params.messageListID;

// 	if (!messageListID) {
// 		res.status(422).json({ "message": "could not find the required messageListID" })
// 		return;
// 	}

// 	try {
// 		const chatHistory = await Message.find({ messageListID:  messageListID}).lean().exec();

// 		// console.log({ messageListID:  new ObjectId(messageListID)});
// 		console.log(chatHistory);
// 		return res.status(200).json(chatHistory);
// 	}
// 	catch (error){
// 		console.log('errrorrr',error)
// 		 return res.status(500).send(error);

// 	}
// });

// router.delete("/messageListID", async (req, res) => {

// 	const messageID = req.params.messageListID;

// 	if (!messageID) {
// 		return res.status(422).json({ error: "could not find the required messageListID" });
// 	}

// 	try {
// 		const deletedMessage = await Message.deleteOne({ _id: messageID });

// 		if (deletedMessage.deletedCount === 0) {
// 			return res.status(404).json({ error: "No message found for the provided messageID" });
// 		}

// 		res.json({ message: "Message deleted successfully" });
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { Message, MessageList } = require("./models");
// const { Persona } = require("../persona/models");

// router.post("/create", async (req, res) => {
//   try {
//     console.log(req.body);
//     const persona = await Persona.findById(req.body.personaID);

//     console.log(persona);
//     if (!persona || persona.size() === 0) {
//       res
//         .status(404)
//         .json({ message: "No Persona found with the given personaID" });
//       return;
//     }

//     const messageListAttributes = {
//       personaID: req.body.personaID,
//       userID: req.body.userID,
//       name: req.body.name,
//       phoneNo: req.body.phoneNo,
//       countryCode: req.body.countryCode,
//     };

//     const messageList = new MessageList(messageListAttributes);
//     await messageList.save();
//     res.status(201).json(messageList);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error);
//   }
// });

// router.put("/:messageListID", async (req, res) => {
//   const messageListID = req.params.messageListID;
//   const textInput = req.body.textInput;

//   if (!messageListID || !textInput) {
//     res
//       .status(422)
//       .json({ message: "Could not find messageListID and/or textInput" });
//     return;
//   }

//   const messageList = await MessageList.findById(messageListID);

//   if (!messageList) {
//     res.status(404).json({ message: "Could not find the MessageList" });
//     return;
//   }

//   const persona = await Persona.findById(messageList.personaID);

//   if (!persona) {
//     res.status(404).json({ message: "Could not find the given Persona" });
//     return;
//   }

//   const userMessage = await Message.create({
//     role: "user",
//     content: textInput,
//     isUser: true,
//     messageListID: messageList._id,
//   });

//   return res.status(201).json(userMessage);
// });

// router.get("/:messageListID", async (req, res) => {
//   const messageListID = req.params.messageListID;

//   if (!messageListID) {
//     res
//       .status(422)
//       .json({ message: "Could not find the required messageListID" });
//     return;
//   }

//   try {
//     const chatHistory = await Message.find({ messageListID: messageListID })
//       .lean()
//       .exec();
//     console.log(chatHistory);
//     return res.status(200).json(chatHistory);
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).send(error);
//   }
// });

// router.delete("/:messageListID", async (req, res) => {
//   const messageID = req.params.messageListID;

//   if (!messageID) {
//     return res
//       .status(422)
//       .json({ error: "Could not find the required messageListID" });
//   }

//   try {
//     const deletedMessage = await Message.deleteOne({ _id: messageID });

//     if (deletedMessage.deletedCount === 0) {
//       return res
//         .status(404)
//         .json({ error: "No message found for the provided messageID" });
//     }

//     res.json({ message: "Message deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { Message, MessageList } = require("./models");
// const { Persona } = require("../persona/models");

// router.post("/create", async (req, res) => {
//   const persona = Persona.findById(req.body.personaID);

//   if (!persona || persona.size() == 0) {
//     res
//       .status(404)
//       .json({ message: "no Persona found with the given personaID" });
//     return;
//   }
//   try {
//     const messageListAttributes = {
//       personaID: req.body.personaID,
//       userID: req.body.userID,
//       name: req.body.name,
//       phoneNo: req.body.phoneNo,
//       countryCode: req.body.countryCode,
//     };
//     const messageList = new MessageList(messageListAttributes);
//     await messageList.save();
//     res.status(201).json(messageList);
//   } catch {
//     res.status(500);
//   }
// });

// router.put("/:messageListID", async (req, res) => {
//   const messageListID = req.params.messageListID;
//   console.log(messageListID);
//   const textInput = req.body.textInput;

//   if (!messageListID || !textInput) {
//     res
//       .status(422)
//       .json({ message: "could not find messageListID and/or textInput" });
//     return;
//   }

//   const messageList = await MessageList.findById(messageListID);
//   console.log(messageList);

//   if (!messageList) {
//     res.status(404).json({ message: "could not find the MessageList" });
//     return;
//   }

//   const persona = await Persona.findById(messageList.personaID);

//   if (!persona) {
//     res.status(404).json({ message: "could not find the given Persona" });
//     return;
//   }

//   const userMessage = await Message.create({
//     role: "user",
//     content: textInput,
//     isUser: true,
//     messageListID: messageList._id,
//   });

//   return res.status(201).json(userMessage);
// });

// router.get("/:messageListID", async (req, res) => {
//   const messageListID = req.params.messageListID;

//   if (!messageListID) {
//     res
//       .status(422)
//       .json({ message: "could not find the required messageListID" });
//     return;
//   }

//   try {
//     const chatHistory = await Message.find({ messageListID: messageListID })
//       .lean()
//       .exec();

//     // console.log({ messageListID:  new ObjectId(messageListID)});
//     console.log(chatHistory);
//     return res.status(200).json(chatHistory);
//   } catch (error) {
//     console.log("errrorrr", error);
//     return res.status(500).send(error);
//   }
// });

// router.delete("/messageListID", async (req, res) => {
//   const messageID = req.params.messageListID;

//   if (!messageID) {
//     return res
//       .status(422)
//       .json({ error: "could not find the required messageListID" });
//   }

//   try {
//     const deletedMessage = await Message.deleteOne({ _id: messageID });

//     if (deletedMessage.deletedCount === 0) {
//       return res
//         .status(404)
//         .json({ error: "No message found for the provided messageID" });
//     }

//     res.json({ message: "Message deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { Message, MessageList } = require("./models");
const { Persona } = require("../persona/models");

router.post("/create", async (req, res) => {
  const persona = Persona.findById(req.body.personaID);

  // if (!persona || persona.size() == 0) {
  //   res
  //     .status(404)
  //     .json({ message: "no Persona found with the given personaID" });
  //   return;
  // }

  const personaID = req.body.personaID;
  const userID = req.body.userID;

  // Check if a message already exists with the same user ID and persona ID
  const existingMessageList = await MessageList.findOne({
    personaID: personaID,
    userID: userID,
  });

  if (existingMessageList) {
    return res.status(400).json({
      message:
        "A message list already exists with the given user ID and persona ID",
    });
  }
  try {
    const messageListAttributes = {
      personaID: req.body.personaID,
      userID: req.body.userID,
      name: req.body.name,
      phoneNo: req.body.phoneNo,
      countryCode: req.body.countryCode,
    };
    const messageList = new MessageList(messageListAttributes);
    await messageList.save();
    res.status(201).json(messageList);
  } catch {
    res.status(500);
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
