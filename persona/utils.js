const { Persona } = require("./models")

const PersonaPrompt = async (personaID) => {
    const persona = await Persona.findById(personaID)
    const format = ["system", persona.instruction]
    return format
}