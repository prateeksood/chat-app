/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
*/

const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const UserService = require("../services/user.service");
const dataValidation = require('../validations/register.validation');

module.exports = class UserController {
  /**
   * @param {Request} request
   * @param {Response} response
   * @param {NextFunction} next
   */
  static async registerUser(request, response, next) {
    let image = request.file ? request.file.filename : null;

    const {
      name,
      email,
      username,
      password,
      confirmPassword,
    } = request.body;
    const tokenExpiry = 2592000;
    const hashRounds = 10;
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
      const hashedPassword = await bcrypt.hash(password, hashRounds);
      let savedUser = await UserService.saveNewUser({
        name,
        email,
        username,
        password: hashedPassword,
        image
      });
      jwt.sign(savedUser, process.env.JWT_SECRET, { expiresIn: tokenExpiry }, async (ex, token) => {
        if(ex){
          throw ex;
        }
        response.cookie("token",token,{
          maxAge:tokenExpiry,
          path:"/",
          sameSite:"strict",
          httpOnly:true
        }).status(200).json(savedUser);
      });


    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }

  /**
   * @param {Request} request
   * @param {Response} response
   * @param {NextFunction} next
   */
  static async loginUser(request, response, next) {
    const {
      username,
      password
    } = request.body;
    const tokenExpiry = 2592000;
    try {
      const foundUser = await UserService.getSingleUserByParams({ username }, true);
      if (!foundUser)
        response.status(401).json({ message: "User not found" });

      else {
        const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
        delete foundUser.password;
        if (!isPasswordMatch)
          response.status(401).json({ message: "Invalid Password" });
        jwt.sign(foundUser, process.env.JWT_SECRET, {
          expiresIn: tokenExpiry
        }, (err, token) => {
          if (err)
            response.status(500).send(`Something went wrong : ${err.message}`);
          else {
            response.cookie("token",token,{
              maxAge:tokenExpiry,
              path:"/",
              sameSite:"strict",
              httpOnly:true
            }).status(200).json(foundUser);
          }
        });

      }
    }
    catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }

  /**
   * @param {Request} request
   * @param {Response} response
   * @param {NextFunction} next
   */
  static async searchUsers(request, response, next) {
    try {
      const { key } = request.query;
      const foundUsers = await UserService.searchUsers(key);
      response.status(200).json(foundUsers);
    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }

  /**
   * @param {Request} request
   * @param {Response} response
   * @param {NextFunction} next
   */
  static async sendRequest(request, response, next) {
    try {
      const { _id: requestSenderId } = request.user;
      const { requestRecieverId } = request.params;
      if (!UserService.isValidId(requestRecieverId))
        throw "Invalid user Id";
      const isRequestAlreadySent = await UserService.searchInArray(requestSenderId, "sentRequests", "user", requestRecieverId) > -1;
      if (isRequestAlreadySent) {
        response.status(400).json({ message: "You have already sent a request to this user" });
        return;
      }
      const isAlreadyContact = await UserService.searchInArray(requestSenderId, "contacts", "user", requestRecieverId) > -1;
      if (isAlreadyContact) {
        response.status(400).json({ message: "You are already connected to this user" });
        return;
      }
      let [updatedSender, updatedReciever] = await Promise.all(
        [
          UserService.findUserByIdAndUpdate(requestSenderId, { sentRequests: { user: requestRecieverId } }, "push"),
          UserService.findUserByIdAndUpdate(requestRecieverId, { recievedRequests: { user: requestSenderId } }, "push")
        ]
      )
      if (updatedSender && updatedReciever) {
        response.status(200).json({ message: "Request successfully sent" });
        return;
      }
      response.status(400).json({ message: "Unable to send request" });
    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }


  /**
   * @param {Request} request
   * @param {Response} response
   * @param {NextFunction} next
   */
  static async acceptRequest(request, response, next) {
    try {
      const { _id: requestSenderId } = request.user;
      const { requestRecieverId } = request.params;
      if (!UserService.isValidId(requestRecieverId))
        throw "Invalid user Id";
      let [updatedSender, updatedReciever] = await Promise.all(
        [
          UserService.findUserByIdAndUpdate(requestSenderId, { contacts: { user: requestRecieverId } }, "push"),
          UserService.findUserByIdAndUpdate(requestRecieverId, { contacts: { user: requestSenderId } }, "push")
        ]
      );
      if (updatedSender && updatedReciever) {
        [updatedSender, updatedReciever] = await Promise.all(
          [
            UserService.findUserByIdAndUpdate(requestSenderId, { sentRequests: { user: requestRecieverId } }, "pull"),
            UserService.findUserByIdAndUpdate(requestRecieverId, { recievedRequests: { user: requestSenderId } }, "pull")
          ]
        );
        if (updatedSender && updatedReciever) {
          response.status(200).json({ message: "Request successfully accepted" });
          return;
        }
      }
      response.status(400).json({ message: "Unable to accept request" });
    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }

  /**
   * @param {Request} request
   * @param {Response} response
   * @param {NextFunction} next
   */
   static async deleteRequest(request, response, next) {
    try {
      const { _id: requestSenderId } = request.user;
      const { requestRecieverId } = request.params;
      if (!UserService.isValidId(requestRecieverId))
        throw "Invalid user Id";
      let [updatedSender, updatedReciever] = await Promise.all([
        UserService.findUserByIdAndUpdate(requestSenderId, { contacts: { user: requestRecieverId } }, "pop"),
        UserService.findUserByIdAndUpdate(requestRecieverId, { contacts: { user: requestSenderId } }, "pop")
      ]);
      if (updatedSender && updatedReciever) {
        response.status(200).json({ message: "Request deleted" });
        return;
      }
      response.status(400).json({ message: "Unable to accept request" });
    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }

  /**
   * @param {Request} request
   * @param {Response} response
   * @param {NextFunction} next
   */
  static async blockUser(request, response, next) {
    try {
      const { _id: blockerId } = request.user;
      const { userToBeBlockedId } = request.params;
      if (!UserService.isValidId(userToBeBlockedId))
        throw "Invalid user Id";
      const isAlreadyBlocked = await UserService.searchInArray(blockerId, "blocked", "user", userToBeBlockedId) > -1;
      if (isAlreadyBlocked) {
        response.status(400).json({ message: "User already blocked" });
        return;
      }
      await UserService.findUserByIdAndUpdate(blockerId, { blocked: { user: userToBeBlockedId } }, "push");
      response.status(200).json({ message: "User successfully blocked" });
    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }

  /**
   * @param {Request} request
   * @param {Response} response
   * @param {NextFunction} next
   */
  static async unblockUser(request, response, next) {
    try {
      const { _id: unblockerId } = request.user;
      const { userToBeUnblockedId } = request.params;
      if (!UserService.isValidId(userToBeUnblockedId))
        throw "Invalid user Id";
      const isAlreadyUnblocked = await UserService.searchInArray(unblockerId, "blocked", "user", userToBeUnblockedId) === -1;
      if (isAlreadyUnblocked) {
        response.status(400).json({ message: "User already unblocked" });
        return;
      }
      await UserService.findUserByIdAndUpdate(unblockerId, { blocked: { user: userToBeUnblockedId } }, "pull");
      response.status(200).json({ message: "User successfully unblocked" });
    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }

  /**
   * @param {Request} request
   * @param {Response} response
   * @param {NextFunction} next
   */
  static async uploadProfilePicture(request, response, next) {
    try {
      if (!request.file) {
        response.status(400).json({ message: "No file found! Kindly provide a file to upload" });
        return;
      }
      const { filename } = request.file;
      const { _id: currentUserId } = request.user;
      const updatedUser = await UserService.findUserByIdAndUpdate(currentUserId, { image: filename });
      response.status(200).json(updatedUser);
    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }
}