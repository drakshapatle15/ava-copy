const { MessageList, Message } = require("./models")
const {SystemMessage, HumanMessage, AIMessage} = require("langchain/schema")


const lastKChats = async (messageListID, k) => {
    const recentChats = await Message.find({}).limit(k)
    const format = []
    recentChats.map((chat)=>{format.push(chat.isUser?new HumanMessage(chat.content):new AIMessage(chat.content))})
    return format
}

module.exports = {lastKChats}