const router = require("express").Router();
const userController = require("../controllers/user.controller");
const uploadProfilePicture = require("../helpers/imageUpload.helper");
require("dotenv").config();

router.post("/", uploadProfilePicture.single("profilePicture"), userController.registerUser);

module.exports = router;