// const { APIAuth, User } = require("./models");

// const authenticateUser = async (req, res, next) => {
//   try {
//     const headerKey = req.header("api-key");

//     const apiObj = await APIAuth.findOne({ key: headerKey });

//     if (!apiObj) {
//       throw Error("Key not found");
//     }

//     req.apiKey = headerKey;
//     req.userID = apiObj.userID;
//     console.log(headerKey);
//     console.log(apiObj);
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(401).send({ error: "Authentication failed" });
//   }
// };

// module.exports = authenticateUser;

const { APIAuth, User } = require("./models");

const authenticateUser = async (req, res, next) => {
  try {
    const headerKey = req.header("api-key");

    const apiObj = await APIAuth.findOne({ key: headerKey });

    if (!apiObj) {
      throw Error("Key not found");
    }

    req.apiKey = headerKey;
    req.userID = apiObj.userID;
    console.log(headerKey);
    console.log(apiObj);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Authentication failed" });
  }
};

module.exports = authenticateUser;
