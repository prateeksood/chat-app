const router = require("express").Router();
const Chat = require("../models/Chat.model");
const authMiddleware = require("../middlewares/auth.middleware");
router.get("/", authMiddleware, async (request, response) => {
  const {
    _id
  } = request.user
  try {

    let foundChats = await Chat.find({
      "participants.userID": _id
    });
    response.status(200).json(foundChats);
  } catch (err) {
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
})

module.exports = router;