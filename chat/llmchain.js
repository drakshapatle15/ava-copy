const { ChatOpenAI } = require("langchain/chat_models/openai");
const { BufferMemory } = require("langchain/memory");
const { ConversationChain } = require("langchain/chains");
const { ChatPromptTemplate, MessagesPlaceholder } = require("langchain/prompts");

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_APIKEY,
    temperature: parseInt(process.env.GPT_TEMPERATURE),
    model: process.env.GPT_MODEL,
})

module.exports = {model}