const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserService = require("../services/user.service");
const dataValidation = require('../validations/register.validation');

module.exports = class UserController {
  /**
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   */

  static async registerUser(request, response, next) {
    const {
      name,
      email,
      username,
      password,
      confirmPassword
    } = request.body;
    const tokenExpiry = 2592000;
    try {
      const existingEmail = await UserService.getSingleUserByParams({
        email
      });
      const existingUsername = await UserService.getSingleUserByParams({
        username
      });
      let message = null;
      if (existingEmail) {
        message = "Email address already in use! Try again with different email.";
      } else if (existingUsername) {
        message = "Username address already in use! Try again with different username.";
      } else if (!dataValidation.username.test(username)) {
        message = "Invalid username, Requirements: Minimum 4 characters, maximum 20 characters, numbers and letters are allowed, only special characters allowed are . (dot) and _ (underscore)";
      } else if (!dataValidation.email.test(email)) {
        message = "Invalid email adress";
      } else if (!dataValidation.password.test(password)) {
        message = "Invalid password. Requirements: Minimum 6 characters, maximum 50 characters, at least one letter, one number and one special character";
      } else if (password !== confirmPassword) {
        message = "Password does not match";
      }
      if (message) {
        response.status(400).json({
          message
        });
        return;
      }
      let savedUser = await UserService.saveNewUser({
        name,
        email,
        username,
        password
      });
      jwt.sign(savedUser, process.env.JWT_SECRET, { expiresIn: tokenExpiry }, async (ex, token) => {
        if (ex)
          response.status(500).json({
            message: `Something went wrong : ${ex.message}`
          });
        else {
          savedUser = {
            ...savedUser,
            token
          };
          response.status(200).json(savedUser);
        }
      });


    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }

  /**
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   */
  static async loginUser(request, response, next) {
    const {
      username,
      password
    } = request.body;
    const tokenExpiry = 2592000;
    try {
      const foundUser = await UserService.getSingleUserByParams({ username, password });
      if (!foundUser)
        response.status(401).json({ message: "Inavalid username or password" });
      else {
        console.log(foundUser);
        jwt.sign(foundUser, process.env.JWT_SECRET, {
          expiresIn: tokenExpiry
        }, (err, token) => {
          if (err)
            response.status(500).send(`Something went wrong : ${err.message}`);
          else {
            response.status(200).json({
              ...foundUser,
              token
            });
          }
        });

      }
    }
    catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }
}