const router = require("express").Router();
const userController = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/auth.middleware");
const uploadProfilePicture = require("../helpers/imageUpload.helper");

router.get("/search", authMiddleware, userController.searchUsers);
router.get("/request/send/:requestRecieverId", authMiddleware, userController.sendRequest);
router.get("/request/accept/:requestRecieverId", authMiddleware, userController.acceptRequest);
router.get("/block/:userToBeBlockedId", authMiddleware, userController.blockUser);
router.get("/unblock/:userToBeUnblockedId", authMiddleware, userController.unblockUser);
router.post("/upload/profilePicture", authMiddleware, uploadProfilePicture.single("profilePicture"), userController.uploadProfilePicture);

module.exports = router;