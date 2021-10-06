const router = require("express").Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User.model");
const dataValidation = require('../validations/register.validation')

router.post("/", async function (request, response) {

  const tokenExpiry = 2592000;

  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      username
    } = request.body;
    let existingUser = await User.findOne({
      email
    });
    let existingUsername = await User.findOne({
      username
    });
    if (existingUser) {
      response.status(400).send("Email already exists, try again with different email");
    } else if (existingUsername) {
      response.status(400).send("Username already taken, try again with different username");
    } else if (!dataValidation.username.test(username)) {
      response.status(400).send("Invalid username, Requirements: Minimum 4 characters, maximum 20 characters, numbers and letters are allowed, only special characters allowed are . (dot) and _ (underscore)");
    } else if (!dataValidation.email.test(email)) {
      response.status(400).send("Invalid email adress");
    } else if (!dataValidation.password.test(password)) {
      response.status(400).send("Invalid password. Requirements: Minimum 6 characters, maximum 50 characters, at least one letter, one number and one special character");
    } else if (password !== confirmPassword) {
      response.status(400).send("Password does not match");
    } else {
      let newUser = await new User({
        name: fullName,
        email,
        password,
        username: username.toLowerCase(),
      });
      await newUser.save();
      newUser = newUser._doc;
      delete newUser.password;
      jwt.sign(newUser, process.env.JWT_SECRET, {
        expiresIn: tokenExpiry
      }, async (err, token) => {
        if (err)
          response.status(500).send(`Something went wrong : ${err.message}`);
        else {
          newUser = {
            ...newUser,
            token
          };
          response.status(200).json(newUser);
        }
      });
    }
  } catch (err) {
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
});

module.exports = router;