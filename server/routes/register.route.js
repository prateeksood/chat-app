const router = require("express").Router();
const userController = require("../controllers/user.controller");
require("dotenv").config();

router.post("/", userController.registerUser);

module.exports = router;