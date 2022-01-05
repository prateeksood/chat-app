const router = require("express").Router();
const ContactController = require("../controllers/contact.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, ContactController.getContactsByCurrentUserId);
router.post("/create", authMiddleware, ContactController.createContact);

module.exports = router;