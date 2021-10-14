const router = require("express").Router();
const userController = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/search", authMiddleware, userController.searchUsers);
router.get("/request/send/:requestRecieverId", authMiddleware, userController.sendRequest);
router.get("/request/accept/:requestRecieverId", authMiddleware, userController.acceptRequest);
router.get("/block/:userToBeBlockedId", authMiddleware, userController.blockUser);

module.exports = router;