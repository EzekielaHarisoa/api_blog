

const express = require('express');
const router = express.Router();
const followController = require("../controllers/follow.controller");
const authMiddleware = require("../middlewares/middleware");    

router.post("/follow/:followId", authMiddleware, followController.followUser);
router.delete("/unfollow/:followId", authMiddleware, followController.unfollowUser);

module.exports = router;