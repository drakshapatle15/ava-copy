const chatGPT = require('axios.conf.js')
const fs = require('fs')

const addUserMessage = (userID, personaID, chatText) => {
	const users = JSON.parse(fs.readFileSync("users.json", 'utf8'));
	const userDoc = users.find((user)=> user.id == userID)
	const messages = userDoc['personas'].find((persona) => persona._id == personaID)['messages']
	const lastMessageIsUserMessage = messages[-1]['isUser']

	if (!lastMessageIsUserMessage) {
		throw new Error("Not implemented. Cannot push two connsecutive user messages.")
	}
	new_message = {
		"content": chatText,
		"isUser": true,
	}
	updated_messaged = messages.push(new_message)
	userDoc['personas'].find((persona) => persona._id == personaID)['messages'] = updated_messaged
	fs.writeFile(JSON.stringify(userDoc), 'utf8');
	return true
}

const messageObjToGPTFormat = (messages)=> {
	return messages.map((message)=> {return {"role": message.isUser?"user":"assist", "content":message.content}})
}

const fetchGPTMessage = async (userID, personaID) => {
	const users = JSON.parse(fs.readFileSync("users.json", 'utf8'));
	const userDoc = users.find((user)=> user.id == userID)
	const messages = userDoc['personas'].find((persona) => persona._id == personaID)['messages']
	const response = await chatGPT.post("/completions", {
		"model": process.env.GPT_MODEL,
		"messages": messageObjToGPTFormat(messages),
		"temperature": Integer.parseInt((process.env.GPT_TEMPERATURE))
	})
	return response['choices']['message']['content']
}

module.exports = chatGPT
