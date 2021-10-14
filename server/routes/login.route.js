const router = require("express").Router();
const userController = require("../controllers/user.controller")
require("dotenv").config();
const User = require("../models/User.model");

router.post("/", userController.loginUser);

module.exports = router;