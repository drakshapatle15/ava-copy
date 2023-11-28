const express = require('express');
const initializePersonas = require("./migrate-v1")
const router = express.Router();

router.post("/test", async (req, res) => {
    res.send({ "message": "hello" })
})


router.post("/init", async (req, res) => {
    await initializePersonas()
    res.send({ "message": "Created all the personas" })
})

module.exports = router