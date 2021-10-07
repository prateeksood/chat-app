const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 */

const auth = (request, response, next) => {
  const token = request.header("x-auth-token");
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