var express = require("express");
var dotenv = require("dotenv");
dotenv.config();

var db = require("./database");
const bodyParser = require("body-parser");
const chatRouter = require("./chat/router");
const personaRouter = require("./persona/router");
const initializePersonas = require("./persona/migrate-v1");
const port = 5005;

var app = express();
app.use(bodyParser.json());
app.use("/chat", chatRouter);
app.use("/persona", personaRouter);

const { APIAuth, User } = require("./auth/models");
const { MessageList } = require("./chat/models");
const { Persona } = require("./persona/models");

app.post("/initdb", async (req, res) => {
  const adminUser = new User({ name: "admin" }, {}, { new: true });
  await adminUser.save();

  const adminKey = new APIAuth(
    { key: process.env.ADMIN_APIKEY, userID: adminUser._id, role: "admin" },
    {},
    { new: true }
  );
  await adminKey.save();

  await initializePersonas();

  const samplePersona = await Persona.findOne({});
  console.log(samplePersona);
  const adminMessageList = new MessageList(
    { userID: adminKey.userID, personaID: samplePersona._id },
    {},
    { new: true }
  );
  await adminMessageList.save();
  res.send({ message: "database initialised" });
});

app.listen(port);
