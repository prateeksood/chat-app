const router = require("express").Router();
const UserService = require("../services/user.service");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/imageUpload.helper");

router.get("/auth", authMiddleware, async (request, response) => {
  if (request.user) {
    response.status(200).json(await UserService.getUserByID(request.user._id));
  } else {
    response.status(401).send("Invalid Token, Access Denied");
  }
});
router.get("/", userController.fetchAllUsers);
router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);
router.get("/search", authMiddleware, userController.searchUsers);
router.get("/:id", authMiddleware, userController.searchUserById);
router.post("/upload/profilePicture", authMiddleware, uploadMiddleware.single("profilePicture"), userController.uploadProfilePicture);

router.post("/:requestRecieverId/request/send", authMiddleware, userController.sendRequest);
router.post("/:requestRecieverId/request/accept", authMiddleware, userController.acceptRequest);
router.post("/:requestRecieverId/request/delete", authMiddleware, userController.deleteRequest);
router.post("/:userToBeBlockedId/block", authMiddleware, userController.blockUser);
router.post("/:userToBeUnblockedId/unblock", authMiddleware, userController.unblockUser);

module.exports = router;