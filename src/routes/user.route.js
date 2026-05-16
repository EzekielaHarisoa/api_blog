const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/middleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);

router.post("/avatar",authMiddleware,uploadMiddleware.single("avatar"),userController.updateUserAvatar );

module.exports = router;