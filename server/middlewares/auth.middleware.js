const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 */

const auth = (request, response, next) => {
  if (!request.headers.cookie){
    response.status(401).send("Token not found, access denied");
    return;
  }
  const token = request.headers.cookie.split(";").filter(cookieStr => {
    return cookieStr.search("token=") >= 0;
  }).map(cookieStr => {
    return cookieStr.split("=")[1].trim();
  })[0];
  // const token = request.header("x-auth-token");
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