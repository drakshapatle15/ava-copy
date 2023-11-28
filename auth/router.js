// const express = require('express');
// const router = express.Router();
// const { ObjectId } = require('bson');
// const {User} = require("./models");

// const authenticateUser = require("./middlewares")

// router.post("/apikey/create", authenticateUser, async (req, res)=>{
//     res.send({"mess":"hi"})
// })

// // router.post("/init-persona", async (req, res)=>{
// //     const personas = await fetch("https://apiava.websperotech.com/persona")
// //     const data = personas.json()

// // })

// module.exports = router

const express = require("express");
const router = express.Router();
const { ObjectId } = require("bson");
const { User } = require("./models");

const authenticateUser = require("./middlewares");

router.post("/apikey/create", authenticateUser, async (req, res) => {
  res.send({ mess: "hi" });
});

// router.post("/init-persona", async (req, res)=>{
//     const personas = await fetch("https://apiava.websperotech.com/persona")
//     const data = personas.json()

// })

module.exports = router;

router.post("/register", async (req, res) => {
  try {
    const { name } = req.body;

    // Validate input fields as needed

    const newUser = new User({ name });
    await newUser.save();

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
