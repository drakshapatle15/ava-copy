const express = require("express");
const router = express.Router();
const { ObjectId } = require("bson");
const { User } = require("./models");

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
