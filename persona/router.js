const express = require('express');
const initializePersonas = require("./migrate-v1")
const router = express.Router();

const {Persona} = require('./models')


router.get("/", async (req, res) => {
    let personas =  await Persona.find();
    res.send(personas)
})

router.get("/:personaID", async (req, res) => {
    let persona =  await Persona.find({_id:req.params.personaID});
    res.send(persona)
})

router.delete("/:personaID", async (req, res) => {
    let result =  await Persona.deleteOne({_id:req.params.personaID});
    res.send(result)
})

router.patch("/:personaID", async (req, res) => {
    let updatedPersona = req.body.persona;
    let result =  await Persona.updateOne({_id:req.params.personaID}, updatedPersona);
    res.send(result)
})

router.post("/migrate-v1", async (req, res) => {
    try{
        await initializePersonas()
        res.send({ "message": "Created all the old personas" })
    }
    catch{
        res.status(500).json({"message":"could not migrate to all the older persona"})
    }
})

module.exports = router