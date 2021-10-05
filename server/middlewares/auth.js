const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (request, response, next) => {
  const token = request.headers("x-auth-token");
  // const token = jwt.sign("123", process.env.JWT_SECRET);
  if (!token) response.status(401).send("Token not found, access denied");
  else {
    try {
      const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
      request.user = decodedUser;
      next();
    } catch (err) {
      response.status(500).send(`Something went wrong : ${err.message}`);
    }
  }
};

module.exports = auth;
