require("dotenv").config();

const mongoose = require("mongoose");
const db_uri = process.env.MONGODB_URI;
console.log("hii");
console.log(db_uri);
const connection = mongoose.connect(db_uri);
const db = mongoose.connection;

db.on("error", (error) => {
  console.log("Database Could Not Get Connected");
  console.log(error);
});

db.once("connected", () => {
  console.log("Database Connected");
});
