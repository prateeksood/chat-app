const router = require("express").Router();
const jwt = require("jsonwebtoken");
const userController = require("../controllers/user.controller")
require("dotenv").config();
const User = require("../models/User.model");
const dataValidation = require('../validations/register.validation')

router.post("/", userController.registerUser);

module.exports = router;